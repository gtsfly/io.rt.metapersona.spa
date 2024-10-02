export class ReservationConfirmedDto {
  confirmed_reservation_id?: number;
  reservation_request_id: number;
  hotel_id: number;
  check_in_date: string;
  check_out_date: string;
  price: number;
  room_type: string;
  board_type: string;
  confirm_date: string;
  user_id: number;
  user_name: string;

  constructor(
    reservation_request_id: number,
    hotel_id: number,
    check_in_date: string,
    check_out_date: string,
    price: number,
    room_type: string,
    board_type: string,
    confirm_date: string,
    user_id: number,
    user_name: string,
    confirmed_reservation_id?: number
  ) {
    this.confirmed_reservation_id = confirmed_reservation_id;
    this.reservation_request_id = reservation_request_id;
    this.hotel_id = hotel_id;
    this.check_in_date = check_in_date;
    this.check_out_date = check_out_date;
    this.price = price;
    this.room_type = room_type;
    this.board_type = board_type;
    this.confirm_date = confirm_date;
    this.user_id = user_id;
    this.user_name = user_name;
  }
}
