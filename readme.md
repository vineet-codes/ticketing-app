# Ticketing Application

This is a microservices based application written in `TypeScript` and `Node.js`. Frontend is a server side rendered react application written in `Next.js`. We use `MongoDB` and `Redis` for our data storage needs. All interservice communication is aynchronous. We deploy this application by first containerizing individual services using `Docker`. We then orchestrate the containers in a `Kubernetes cluster` to make our product reliable and more manageble.

To run the app, run

> skaffold dev

## Product Requirements / Business Logic

1. **Users** can list a **ticket** for an event for sale
2. Other users can purchase this **ticket**
3. Any user can _list_ tickets for sale and _purchase_ tickets
4. When a user _attempts_ to purchase a ticket, the ticket is `locked` for 15 minutes. The users have 15 mins to enter their payment info
5. While locked, no other user can purchase the ticket. After 15 mins, ticket should `unlock`
6. Ticket prices can be edited if they are not locked

## Technical Solution Design

### Resource Types

Let's think about the entities in our domain that we are trying to model. It is useful to think about the domain we are trying to model. People sometime

1. **User**
   - user.id
   - user.name
   - user.password
   - user.email
   - user.phone
2. **Ticket**
   - ticket.id - pk
   - ticket.name - string
   - ticket.description - string
   - ticket.userId - Ref to User
   - ticket.orderId - Ref to Order
3. **Order** - represents the intent of the user to buy the ticket, we lock the ticket at this stage
   - order.id
   - order.userId - Ref to User
   - order.ticketId - Ref to ticket
   - order.status - Created | Cancelled | Awaiting Payment | Completed
   - order.expiresAt - Date
4. **Charge**
   - charge.id
   - charge.orderId - Ref to Order
   - charge.status - Created | Failed | Completed
   - charge.amount - numeber
   - charge.stripeId - string
   - charge.stripeRefundId - string

### Service Types

1. **auth** : Everything related to user signup/signin/signout
2. **tickets**: Ticket creating/editing. Knows about wheather a ticket can be updated
3. **orders**: Order creation/editing
4. **expiration**: watches for orders to be created, cancels them after 15 minutes
5. **payments**: Handle credit card payments. Cancel order if payment fails, completes if payment succeeds

> We are creating individual service to manage each type of resource. This probably is not neccessary. Choices will depend on your use cases, number of resources, business logic tied to each resource etc. You can look into 'feature-based design` which might be better. read more about it [here](https://web.mst.edu/~liou/ME459/cad_cam_intgr/feature_based_dgn.html)

### Events

1. User
   - UserCreated
   - UserUpdated
2. Ticket
   - TicketCreated
   - TicketUpdated
3. Order
   - OrderCreated
   - OrderCancelled
   - OrderExpired
4. Charge
   - ChargeCreated

## Notes

- We use ingress-nginx for communicating with kubernetes cluster from outside

### Normalisation Strategies

1. How do we validate all POST requests are well formed with relavent fields ?
   - We use [express-validator](https://express-validator.github.io/docs/) to validate body.
   - Handling validation errors
2. There are many other sources of errors which will result in an error, such as user already exists error, db down error etc.
   - We absolutely have no idea what might go wrong and where
   - We have to make sure that we catch all such errors and handle them in a `consistent manner`.
   - All error responses should be `structurally consistent` for `a service` or even `accross services` which maybe written in different technology stack.

> We solve this by wrting an error handling middlewareto process errors, give them consistent structure, and send back to the user. We also capture all possible errors leveraging express's error handling mechanism (call the next function). You can read more about express error handling [here](https://expressjs.com/en/guide/error-handling.html)

1. Error handling classes which are sub classes of `CustomError`.
2. `CustomError` is an abstract class with `sttusCode` _variable_ and `serializeError` _function_.
3. We use `express-async-errors` to also handle async errors in express similar to sync errors. Otherwise, express requires us to call next funtion in the middleware to handle error properly.
