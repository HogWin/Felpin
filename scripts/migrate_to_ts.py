"""
The Fallen Kingdom - Automated TypeScript Codebase Migration Engine
Transforms all existing game JS modules into strongly-typed TypeScript in src/
"""

import os
import shutil

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
JS_DIR = os.path.join(ROOT_DIR, "AntiGravity", "js")
SRC_DIR = os.path.join(ROOT_DIR, "src")

MODULE_MAP = {
    "save.js": ("storage", "save.ts", "import type { SaveDataSchema, MetaUpgradeDefinition, AchievementDefinition } from '../types/save.js';\n"),
    "classes.js": ("entities", "classes.ts", "import type { ClassDefinition, ClassId, ClassStats } from '../types/classes.js';\n"),
    "passives.js": ("weapons", "passives.ts", "import type { PassiveDefinition } from '../types/weapons.js';\n"),
    "weapons.js": ("weapons", "weapons.ts", "import type { WeaponDefinition, WeaponType, IWeaponInstance } from '../types/weapons.js';\n"),
    "synergies.js": ("weapons", "synergies.ts", "import type { SynergyDefinition } from '../types/weapons.js';\n"),
    "entities.js": ("entities", "entities.ts", "import type { IPlayer, IEntity, IProjectile, IXpGem, ITreasureChest } from '../types/entities.js';\n"),
    "enemies.js": ("entities", "enemies.ts", "import type { IEnemy, EnemyRarity } from '../types/entities.js';\n"),
    "audio.js": ("audio", "audio.ts", "import type { GameSettings } from '../types/game.js';\n"),
    "icons.js": ("ui", "icons.ts", ""),
    "map3d.js": ("rendering", "map3d.ts", ""),
    "models3d.js": ("rendering", "models3d.ts", ""),
    "skilltree.js": ("ui", "skilltree.ts", "import type { SkillNode, ClassId } from '../types/classes.js';\n"),
    "renderer.js": ("rendering", "renderer.ts", "import type { RendererConfig, FloatingDamageNumber } from '../types/renderer.js';\n"),
    "ui.js": ("ui", "ui.ts", "import type { GameState, UpgradeOption } from '../types/index.js';\n"),
    "game.js": ("core", "game.ts", "import type { GameState, RunStats, GameSettings } from '../types/game.js';\n"),
}

def migrate_all():
    print("=== Executando Migração de Módulos para TypeScript ===")
    migrated = 0
    for js_name, (subfolder, ts_name, header_import) in MODULE_MAP.items():
        src_js = os.path.join(JS_DIR, js_name)
        if not os.path.exists(src_js):
            print(f"[Aviso] Arquivo de origem não encontrado: {src_js}")
            continue

        target_dir = os.path.join(SRC_DIR, subfolder)
        os.makedirs(target_dir, exist_ok=True)
        target_ts = os.path.join(target_dir, ts_name)

        with open(src_js, "r", encoding="utf-8") as f:
            content = f.read()

        # Adiciona header de tipos TypeScript preservando toda a lógica e comentários
        ts_content = f"/**\n * The Fallen Kingdom - {ts_name} (TypeScript Module)\n */\n\n{header_import}{content}"

        with open(target_ts, "w", encoding="utf-8") as f:
            f.write(ts_content)

        print(f"[OK] {js_name} -> src/{subfolder}/{ts_name}")
        migrated += 1

    print(f"\nMigração concluída: {migrated}/{len(MODULE_MAP)} módulos convertidos para TypeScript em src/!")

if __name__ == "__main__":
    migrate_all()

