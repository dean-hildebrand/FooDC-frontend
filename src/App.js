import React from "react";
import "./App.css";
import NavBar from "./presentational/NavBar";
import HomePage from "./presentational/HomePage";
import RestaurantCollection from "./containers/RestaurantCollection";
import RestaurantProfile from "./containers/RestaurantProfile";
import UserProfile from "./containers/UserProfile";
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends React.Component {
  state = {
    restaurantsArray: [],
    loading: true,
    currentUser: {id: 19}
  };

  componentDidMount() {
    fetch("http://localhost:3000/restaurants")
      .then(res => res.json())
      .then(data => this.setState({ restaurantsArray: data, loading: false }))
  }

  bookmarkBtnHandler = (restaurant) => {
    fetch('http://localhost:3000/bookmarked_restaurants', {
      method: 'POST',
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
      },
      body: JSON.stringify({user_id: this.state.currentUser.id, restaurant_id: restaurant.id}),
    })
    .then(res => res.json())
    .then(data => console.log(data))
  }

  removeBookmarkHandler = (id) => {
    console.log(id)
    fetch(`http://localhost:3000/bookmarked_restaurants/19/${id}`, {
      method: 'DELETE',
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
      },
    })
  }

  render(){
  return (
    <div className="App">
      {!this.state.loading ? 
      
      <Router>
        <NavBar profileBtn = {this.profileBtnHandler}/>


          <Route
            exact path='/'
            render={(props)=> <HomePage showAllRestaurants={this.showAllRestaurants}/>}
          />
          
          <Route 
          exact
          path='/restaurants' 
          render={(props)=>
            <RestaurantCollection 
            restaurants = {this.state.restaurantsArray} />}/> 

          <Route path ='/restaurants/:id' render={(props) => {
            // console.log(props)
            let id = parseInt(props.match.params.id)
            let restaurantObj = this.state.restaurantsArray.find(rest => rest.id === id)
            return <RestaurantProfile restaurant = {restaurantObj} bookmark = {this.bookmarkBtnHandler}/>
            }
          }/>
          
          <Route path='/users/:id' render={(props) => 
            <UserProfile remove = {this.removeBookmarkHandler} user = {this.state.currentUser.id}/>
          }/>

        </Router>
      
      : 
      
      "Loading!!!!!!"
      
      }
      
      </div>
    )
  }
}

export default App
