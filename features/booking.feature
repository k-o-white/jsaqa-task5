Feature: Booking tickets

  Scenario: User successfully books a free seat
    Given the user opens the page "/client/index.php"
    When the user selects the third day
    When the user focuses on the Need for Speed movie
    When the user selects the 15:30 session
    When the user selects the first free seat
    When the user clicks the booking button
    Then the user sees the text "Вы выбрали билеты:"
    Then the user sees the selected seat

  Scenario: User successfully books multiple free seats
    Given the user opens the page "/client/index.php"
    When the user selects the third day
    When the user focuses on the Knives Out movie
    When the user selects the 15:30 session
    When the user selects the first five free seats
    When the user clicks the booking button
    Then the user sees the text "Вы выбрали билеты:"
    Then the user sees the selected seats

  Scenario: User cannot book an already booked seat
    Given the user opens the page "/client/index.php"
    When the user selects the third day
    When the user focuses on the Stalker movie
    When the user selects the 13:00 session
    When the user selects the first free seat
    When the user clicks the booking button
    Then the user sees the text "Вы выбрали билеты:"
    Then the user sees the selected seat
    When the user gets the booking code
    Then the user sees the text "Электронный билет"
    When the user returns to the the page "/client/index.php"
    When the user selects the third day
    When the user focuses on the Stalker movie
    When the user selects the 13:00 session
    Then the selected seat is marked as booked
    Then the booking button is disabled