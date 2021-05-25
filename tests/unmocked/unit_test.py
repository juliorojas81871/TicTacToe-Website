import unittest
import sys
sys.path.append("../..")
from app import addUser, getUsers

# before running the file comment the listening part of app file in app.py
# uncomment the line 127, 139 in app.py

class TestAppFunctions(unittest.TestCase):
    def setUp(self):
        self.user1 = "abc"
        self.user1_res = 1
        self.user2 = "abc2"
        self.user2_res = 2
        self.tol_users = 2

    def test_addUser(self):
        self.assertEqual(self.user1_res, addUser(self.user1))
        self.assertEqual(self.user2_res, addUser(self.user2))

    def test_getUsers(self):
        test_result = getUsers("dummy_data")
        self.assertEqual(self.tol_users, len(test_result))
        self.assertEqual(test_result, [self.user1, self.user2] )

    def test_players(self):
        self.assertGreaterEqual(self.tol_users, 2)
        test_result = getUsers("dummy_data")
        self.assertEqual(self.user1, test_result[0])
        self.assertEqual(self.user2, test_result[1])

if __name__ == '__main__':
    unittest.main()
