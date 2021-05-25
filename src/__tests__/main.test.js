import MainApp from '../components/main'; 
import React from 'react'
import { render, fireEvent, waitFor, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

// TODO: Before everytime running this file
// Go to main make the socketio end point to local host (uncomment line 12 and comment line 13 in /../component/main.js)
// Run the backend flask server (python app.py)

// Test 
// 1. Test if username enters valid username or not. (invalid username like "", "  ", "    ")
// 2. Check components get rendered properly if username is valid
// 3. Prevent users having multiple same username in a match

afterEach(cleanup);

// test for invalid username entry ----------------
test('Test for invalid username', async () => {
    render(<MainApp />);
    // waitFor( ()=> screen.getByText('submit'));
    // without giving user name click on submit
    expect(screen.getByText("submit")).toHaveTextContent("submit");
    fireEvent.click(screen.getByText('submit'));
    // alert message pops or same page remains
    expect(screen.getByText("submit")).toHaveTextContent("submit")
});


test('Test for invalid username', async () => {
    let test_name = "   "; // empty space as username
    render(<MainApp />);
    // waitFor( ()=> screen.getByText('submit'));
    // without giving user name click on submit
    expect(screen.getByText("submit")).toHaveTextContent("submit");
    fireEvent.change(screen.getByPlaceholderText("username"), {
        target: {value: test_name},
    });

    fireEvent.click(screen.getByText('submit'));
    // alert message pops or same page remains
    expect(screen.getByText("submit")).toHaveTextContent("submit")
});


// test for valid username entry ----------------
test('Test for valid username', async () => {
    let test_name = "test"; // empty space as username
    render(<MainApp />);
    
    expect(screen.getByText("submit")).toHaveTextContent("submit");
    // give a unique username to jump to game window
    fireEvent.change(screen.getByPlaceholderText("username"), {
        target: {value: test_name},
    });

    fireEvent.click(screen.getByText('submit'));
    // SCOREBOARD is now visible if valid user
    // const myElement = await screen.findByText('SCOREBOARD');
    await screen.findByText('SCOREBOARD');
    expect(screen.getByText("SCOREBOARD")).toHaveTextContent("SCOREBOARD")
});


// test for users having same username entry ----------------
test('Test for non-unique username', async () => {
    let test_name = "test"; // give username same as last one
    render(<MainApp />);
    
    expect(screen.getByText("submit")).toHaveTextContent("submit");
    // give a same username as of last to jump to game window
    fireEvent.change(screen.getByPlaceholderText("username"), {
        target: {value: test_name},
    });
    fireEvent.click(screen.getByText('submit'));
    
    // SCOREBOARD isn't visible now
    await screen.findByText('User with this username has already joined in!!');
    expect(screen.getByText("User with this username has already joined in!!")).toHaveTextContent("User with this username has already joined in!!")
});

