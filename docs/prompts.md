
## Prompt 1
I just realised that we are not updating the quiz_attempt table based on User's quiz attempt..
whenever a user completes a quiz this should also be completed..
the frontend handles the calculation of the quiz response I suppose..
so it sends necessary data to backend endpoint which just adds the data to the quiz attempt table..
we need to fix that..


## Prompt 2


ok shoot, I just realised we never created a quiz_group table..
it is not there in the database..
this is the table which connects the group with quizzes..
the leaderboard can be weekly basis and the entire timeline basis..
for this the quiz _ group should have attribute one is date_added, and the attribute like active_this_week? so that leaderboard only takes those scores into account..

first plan this whole thing out..
evaluate my approach and give better suggestions if you feel like..

some things to consider: 
- try to reuse the existing ui components as much as possible instead of changing everytime..
- try to be completely aware of the database schema and table so that you make the most optimal use of it in the backend calls. 
- 
