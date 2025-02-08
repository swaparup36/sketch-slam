export interface CreateRoomFormData {
  username: string;
  rounds: number;
  maxPlayers: number;
}

export interface JoinRoomFormData {
  username: string;
  roomcode: string
}

export interface Player {
  username: string,
  avatar: string,
}