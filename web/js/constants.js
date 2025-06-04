const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_SPEED = 150;
const CLIMB_SPEED = 100;
const ENEMY_SPEED_BASE = 80;
const COMPONENT_FALL_SPEED = 200;
const POINTS_PER_COMPONENT = 10;
const POINTS_PER_ENEMY_HIT = 20;
const POINTS_PER_RACK_COMPLETE = 200;
const SPEED_BONUS_TIME = 120;
const SPEED_BONUS_POINTS = 100;
const POWERUP_UNUSED_BONUS = 50;

const ASSETS = {
  SPRITESHEET_PLAYER: 'player',
  SPRITESHEET_ENEMY: 'enemySprites',
  TILESET_PLATFORMS: 'platformTiles',
  TILESET_LADDERS: 'ladderTiles',
  SPRITESHEET_COMPONENTS: 'components',
  SPRITESHEET_POWERUPS: 'powerups',
  AUDIO_BGM: 'bgm',
  SFX_DROP: 'sfxDrop',
  SFX_ENEMY_STUN: 'sfxEnemyStun',
  SFX_PLAYER_HURT: 'sfxPlayerHurt',
  SFX_POWERUP_PICK: 'sfxPowerupPick',
  SFX_POWERUP_USE: 'sfxPowerupUse',
  SFX_RACK_COMPLETE: 'sfxRackComplete',
  SFX_GAME_OVER: 'sfxGameOver'
};
