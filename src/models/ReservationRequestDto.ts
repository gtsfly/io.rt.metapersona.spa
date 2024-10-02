export class ReservationRequestDto {
  constructor(
    public reservation_id: number,
    public user_id: number,
    public user_name: string,
    public check_in_range_start: Date,
    public check_in_range_end: Date,
    public budget: number,
    public location: string,
    public stay_duration: number,
    public exp_1: string,
    public exp_1_rating: number,
    public exp_2: string,
    public exp_2_rating: number,
    public exp_3: string,
    public exp_3_rating: number,
    public adult_num: number,
    public child_num: number,
    public children_ages: number[]
  ) {}
}
