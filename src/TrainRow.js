import React from 'react'
import './style.css';

class TrainRow extends React.Component {

    render(){

        const {time,train,name,laststation,estimatedTime} = this.props

        /*if estimated time is found, define timee with estimated time*/

        const timeElement = estimatedTime !== null
            ? ( 
                <td className="estimatedtd-cell">
                    <span className="estimatedTime">{estimatedTime}</span>
                    <br/> 
                    <span className="Time">({time})</span>
                    </td>
            )
            : <td>{time}</td>

        if (this.props.cancelled === false) {
    return<tr key ={train.trainNumber}>
                 <td>
                 <p>{train.trainType} {train.trainNumber}</p>
                 </td>
                 <td> 
                 {name}
                 </td>
                 <td> 
                 {laststation}
                 </td>
                 {timeElement}
                 </tr>

/*Returns a table cell*/

        } return <tr key ={this.props.train.trainNumber} className={'Cancel'}>
                 <td>
                 {this.props.train.trainType} {this.props.train.trainNumber}
                 </td>
                 <td> 
                 {this.props.name}
                 </td>
                 <td> 
                 {this.props.laststation}
                 </td>
                 <td> 
                {time} <br/>
                <p>Cancelled</p>
                 </td>
                 </tr>
    }

}
export default TrainRow