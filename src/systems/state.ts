export class GameState {elapsed=0;paused=false;update(dt:number){if(!this.paused)this.elapsed+=dt;}}
