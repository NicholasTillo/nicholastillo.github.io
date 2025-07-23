import React from "react";
import Song from "../components/Song.js";
import './basepages.css'

export default class About extends React.Component {
    render(){
        return(
            <div className="mainBody">

            <h2> Biography </h2>
            
            <p> What information goes in a biography, story, schooling
                working
                dreams, aspirations
                maybe just put alot of links to what ive done, want to do
                keep a public fourm for notes on game ideas?  who knose? 
            </p>

            
            <div className="musicSection">
                <h2> some new music </h2>
                <p> Do you know if there is spotify integration? Maybe i make a song component and have a database of favourtie songs. </p>
            
                <Song/>
                <table>
                    <tr> 
                        <th> t1</th> 
                        <th> t1</th>
                        <th> t1</th> 
                        <th> t1</th> 
                        <th> t1</th>  
                    </tr>
                    <tr> 
                        <td> t1</td>
                        <td> t1</td>
                        <td> t1</td>
                        <td> t1</td>
                        <td> t1</td>
                    </tr>
                    <tr> 
                        <td> t1</td>
                        <td> t1</td>
                        <td> t1</td>
                        <td> t1</td>
                        <td> t1</td>
                    </tr>
                    <tr> 
                        <td> t1</td>
                        <td> t1</td>
                        <td> t1</td>
                        <td> t1</td>
                        <td> t1</td>
                    </tr>

                </table>
            </div>

            <div className="gameSection">
                <h2> Some games, but like fr check out the backloggd if you want more </h2>
                
            </div>

            </div>
            )
    }
}
    
