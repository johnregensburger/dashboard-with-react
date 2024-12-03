import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const Library = () => {
 const navigate = useNavigate();
 const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 const [fromValue, setFromValue] = React.useState(1);
 const [toValue, setToValue] = React.useState(8);
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const [games, setGames] = useState([]);
 const [visibleGames, setVisibleGames] = useState(20);
 const [userId, setuserId] = useState(null);

 const checkLoginStatus = async () => {
  try {
    const response = await fetch('http://localhost:3000/test-session', {
      method: 'GET',
      credentials: 'include', // Include cookies in the request
    });

    if (response.ok) {
      const data = await response.json();
      const userId = data.userID; // Extract user ID from response
      setuserId(userId);
      setIsLoggedIn(true);
      console.log('User ID:', userId);
    } else {
      const errorData = await response.json();
      console.error('No active session:', errorData);
    }
  } catch (error) {
    console.error('Error fetching user ID:', error);
    alert('Error fetching user ID.');
  }
};

 const goToFront = () => { //navigate to front page  
    navigate('/front');
  }
  
  const goToInfo = (id, loc) => {
    navigate(`/info/${id}/${loc.toString()}`);
  }

  const logOut = () => {
    setIsLoggedIn((prevState) => !prevState);
    navigate('/'); // Navigate to the Login page
  };
    
  const logIn = () => {
    navigate('/'); // Navigate to the Login page
  }
    
  const toggleSidebar = () => {
      setIsSidebarOpen(prevState => !prevState);
  };

  const fetchGames = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/userlibrary/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      console.log('games fetched');
      const data = await response.json(); // Fetch the data
      setGames(data); //updates the state
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const fetchFilter = async (fromValue, toValue) => {
    try {
      const response = await fetch(`http://localhost:3000/games/filter?minPlayers=${fromValue}&maxPlayers=${toValue}`);
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      console.log('games fetched');
      const data = await response.json(); // Fetch the data
      setGames(data); //updates the state
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const loadMoreGames = () => { //loads more games into the scrollbox
    setVisibleGames((prev) => Math.min(prev + 20, games.length));
  };
    
  useEffect(() => {
    checkLoginStatus();
    fetchGames(userId);
  }, []);

    //TO-DO change "user library" to the user's name in the main section
   return ( 
    <div className={`app ${isSidebarOpen ? "sidebar-open" : ""}`}>
      {/* Header Section */}
      <header>
        <div className="header-left">
          <button className="open-btn" onClick={toggleSidebar}>
            ☰ Filter
          </button>
        </div>
        <div className="header-right">
        <button className="header-btn" onClick={goToFront}>
          Database
        </button>
        {isLoggedIn ? (
            <button className="header-btn" onClick={logOut}>
              Log Out
            </button>
            ) : (
              <button className="header-btn" onClick={logIn}>
                Log In
              </button>
            )}
        </div>
      </header>
    
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="filter" onClick={toggleSidebar}>
          ×
        </button>
        <h2>Filter</h2>
        <h3>Player Number</h3>
        <div className="range_container">
          <div className="sliders_control">
            <input
              id="fromSlider"
              type="range"
              value={fromValue}
              min="1"
              max="8"
              step="1"
              aria-label="Minimum player number"
              onChange={(e) => setFromValue(Math.min(e.target.value, toValue - 1))}
            />
            <input
              id="toSlider"
              type="range"
              value={toValue}
              min="1"
              max="8"
              step="1"
              aria-label="Maximum player number"
              onChange={(e) => setToValue(Math.max(e.target.value, fromValue + 1))}
            />
          </div>
          <div className="form_control">
            <span>Min: {fromValue}</span>
            <span>Max: {toValue}</span>
          </div>
        </div>
        <button className="filter" onClick={() => fetchFilter(fromValue, toValue)}>Filter</button>
      </div>
    <main>
    <h1>User Library</h1> 
        {/* Container for the scrollable button grid */}
        <div className="button-grid" 
      onScroll={(e) => {
          const { scrollTop, scrollHeight, clientHeight } = e.target;
          if (scrollTop + clientHeight >= scrollHeight - 10) {loadMoreGames();}}}>

        {/* maps each game into its own button */}
        {games.length === 0 ? (<p>No games available.</p>) : (
            games.slice(0, visibleGames).map((game) => (
                <button
                    key={game.gameId}
                    className="grid-item"
                    onClick={() => goToInfo(game.gameId, false)}
                    aria-label={`View details for ${game.gameName}`}>
                    <img
                        src={game.boxArtUrl} // Ensure property matches your backend
                        alt={`${game.gameName}`}
                        className="grid-item-img"/>
                    <span className="grid-item-text">{game.gameName}</span>
                </button>
            ))
        )}
      </div>
    </main>
  </div>
   );
 };
  export default Library;