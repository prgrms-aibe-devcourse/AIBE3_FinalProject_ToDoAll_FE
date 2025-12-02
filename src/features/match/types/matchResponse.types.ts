export interface MatchResponseDto {
  id: number;
  status: 'APPLIED' | 'RECOMMENDED' | 'CONFIRMED' | 'BOOKMARK' | 'HOLD' | 'REJECTED';
}
