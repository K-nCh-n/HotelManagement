export interface ISearchParams {
  // Booking Info
  // les dates (début, fin) de réservationou de location
  reservationStartDate ?: Date,
  reservationEndDate ?: Date,
  bookingStartDate ?: Date,
  bookingEndDate ?: Date,

  // Room Info
  //  la superficie
  areaLower ?: number,
  areaUpper ?: number,
  //le prix des chambres
  priceLower ?: number
  priceUpper ?: number
  capacity ?: number, // la capacité des chambres

  // Hotel Info    
  chain ?: string, // la chaîne hôtelière
  category ?: number, // la catégorie (rating 1-5)
  // le nombre total de chambres dans l’hôtel
  numberOfRoomsLower ?: number,
  numberOfRoomsUpper ?: number, 
}

export interface IUserLogin {
  email: string,
  password: string
}

export interface IUserInfo {
  customerNas: string,
  email: string,
  firstName: string,
  lastName: string,
  address: string,
  password: string,
}

export interface IReservation {
  reservationId: string,
  roomId: string,
  customerNas: string,
  reservationStartDate: String,
  reservationEndDate: String,
  reservationDate: String,
  guests: number,
}

export interface IReservationAugmented extends IReservation{
  chainName: string,
  clientName: string,
}