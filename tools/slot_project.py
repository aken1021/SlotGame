"""Initialize slot workspaces and check intake records; does not generate games."""

import argparse
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]


def game_path(game_id):
    if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_-]{0,63}", game_id):
        raise ValueError("game ID must be 1-64 ASCII letters, digits, _ or -")
    if game_id.split(".")[0].upper() in {
        "CON", "PRN", "AUX", "NUL", *(f"COM{i}" for i in range(1, 10)),
        *(f"LPT{i}" for i in range(1, 10)),
    }:
        raise ValueError("reserved Windows game ID")
    base = (ROOT / "games").resolve()
    target = (base / game_id).resolve()
    if target.parent != base or not base.is_relative_to(ROOT.resolve()):
        raise ValueError("game path escapes workspace")
    return target


def initialize(game_id):
    target = game_path(game_id)
    # Never merge into or overwrite an existing game.
    target.mkdir(parents=True, exist_ok=False)
    (target / "spec.md").write_text(
        (ROOT / "templates/game-spec.md").read_text(encoding="utf-8"), encoding="utf-8"
    )
    (target / "requirements.json").write_text(json.dumps({
        "game_id": game_id, "spec_sources": [], "requirements": []
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    for name, content in {
        "TASKS.md": "# 工作狀態\n\n階段：等待規格\n\n下一步：讀取原始規格，建立需求與缺口；尚未產生 server/client。\n",
        "GAPS.md": "# 規格缺口\n\n尚未讀取規格。確認數學設定、server 技術、平台契約與資產。\n",
        "SOURCES.md": "# 來源紀錄\n\n尚未引用來源。每項記錄路徑、版本、檔案位置、用途與使用方式。\n",
        "VERIFICATION.md": "# 驗證紀錄\n\n尚未執行遊戲驗證。開案檢查不能證明遊戲完成。\n",
    }.items():
        (target / name).write_text(content, encoding="utf-8")
    print(f"Created {target}; add specification before implementation.")


def check(game_id):
    target = game_path(game_id)
    errors = []
    for name in ("spec.md", "requirements.json", "TASKS.md", "GAPS.md", "SOURCES.md", "VERIFICATION.md"):
        if not (target / name).is_file():
            errors.append(f"missing {name}")
    path = target / "requirements.json"
    if path.is_file():
        try:
            data = json.loads(path.read_text(encoding="utf-8-sig"))
            if not isinstance(data, dict):
                raise ValueError("requirements root must be an object")
            if data.get("game_id") != game_id:
                errors.append("game_id mismatch")
            sources = data.get("spec_sources")
            if not isinstance(sources, list) or not sources or not all(isinstance(s, str) and s.strip() for s in sources):
                errors.append("spec_sources must contain nonempty source descriptions")
            reqs = data.get("requirements")
            if not isinstance(reqs, list) or not reqs:
                errors.append("requirements must be a nonempty array")
            else:
                seen = set()
                for index, req in enumerate(reqs):
                    if not isinstance(req, dict):
                        errors.append(f"requirement {index}: must be an object")
                        continue
                    for key in ("id", "source", "rule", "acceptance", "status"):
                        if not isinstance(req.get(key), str) or not req[key].strip():
                            errors.append(f"requirement {index}: missing string {key}")
                    rid = req.get("id")
                    if isinstance(rid, str):
                        if rid in seen:
                            errors.append(f"duplicate requirement ID: {rid}")
                        seen.add(rid)
                    if req.get("status") not in ("confirmed", "assumption", "blocked", "demo"):
                        errors.append(f"requirement {index}: invalid status")
        except (ValueError, TypeError) as exc:
            errors.append(f"invalid requirements.json: {exc}")
    if errors:
        print("Intake incomplete:\n" + "\n".join(f"- {e}" for e in errors))
        return 1
    print("Basic intake checks passed. Game behavior and completion are NOT verified.")
    return 0


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=("init", "check"))
    parser.add_argument("game_id")
    args = parser.parse_args()
    try:
        if args.command == "init":
            initialize(args.game_id)
            return 0
        return check(args.game_id)
    except (OSError, ValueError) as exc:
        print(str(exc), file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
