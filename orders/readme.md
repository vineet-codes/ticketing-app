# Orders Microservice

## Routes

1. `api/orders`: Method: `GET` - retrieve all active orders for the given user making the request
2. `api/orders/:id`: Method - `GET` - retrieve an order with specific `id`
3. `api/orders`: Method - `POST` - Create an order to purchase the specified ticket
   - body:
     - `{ticketId: string}`
4. `api/orders/:id`: Method - `DELETE` - Cancel the order
