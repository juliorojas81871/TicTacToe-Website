from unittest.mock import create_autospec 
import sys
import time
sys.path.append("../..")
from app import addUser, getUsers, send_match_db, send_leaderboard

test_users = ["abc", "abc2"]
inserted_time = time.time()
users_count = 1
users = []

def mock_send_match_db():
    pass
send_match_db = create_autospec(mock_send_match_db, return_value=[{"id" : inserted_time, "playerx" : test_users[0], "playero" : test_users[1] }])

def mock_addUser(user_name):
    pass
addUser = create_autospec(mock_addUser, return_value=users_count)


# print(send_match_db())
match_db_received = send_match_db()[0]
send_match_db.assert_called_once_with()
assert match_db_received["playerx"] is test_users[0]
assert match_db_received["playero"] is test_users[1]

# print(addUser(test_users[0]))
user1_status = addUser(test_users[0])
addUser.assert_called_once_with(test_users[0])
users_count += 1
users.append(test_users[0])
assert user1_status is 1

addUser = create_autospec(mock_addUser, return_value=users_count) # update the mock behaviour

# print(addUser(test_users[1]))
user2_status = addUser(test_users[1])
addUser.assert_called()
users_count += 1
users.append(test_users[1])
assert user2_status is 2

def mock_getUsers():
    pass
getUsers = create_autospec(mock_getUsers, return_value=users)

# print(getUsers())
users_received = getUsers()
assert len(users_received) is len(users)
assert users_received is users

print("All Assertion were passed!!")