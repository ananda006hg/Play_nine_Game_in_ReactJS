var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize);
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};


const Stars = (props) =>{
return(
  <div className="col-5">
  	{_.range(props.randomNumberOfstars).map(i=>
     <i key={i} className="fa fa-star"></i>
    )}
  </div>
  );
}

const Answer = (props) =>{
  return(
  <div className="col-5">
  {props.selectedNumbers.map((number,i) =>
   <span key={i}
   onClick={() => props.unselectNumber(number)}
   >{number}</span>
  )}
  </div>
  );
}

const  Button = (props) =>{
let button;
switch(props.answerIsCorrect){
case true:
  button =
    <button className="btn btn-success" onClick={props.acceptAnswer}> 
    <i className="fa fa-check"></i>
    </button>;
  break;
case false:
button =
  <button className="btn btn-danger" >
  <i className="fa fa-times"></i>
  </button>;
break;
default:
button =
  <button className="btn" 
  onClick={props.checkAnswer}
  disabled={props.selectedNumbers.length === 0}
  >=</button>;
break;
}
  return(
  <div className="col-2 text-center">
  {button}
  <br /> <br />
  <button className="btn btn-warning btn-sm" onClick={props.redraw}
  disabled={props.redraws ===0}>
  <i className="fa fa-undo"></i> {props.redraws}
  </button>
  </div>
  );
};

const Doneframe = (props) => {
  return(
	<div className="text-center">
  <h2>{props.doneStatus}</h2>
  <button calssName="btn btn-secondary" onClick={props.resetGame}>Play Again </button>
  </div>
  );
}

const Numbers = (props) =>{
const numberClassName = (number) => {
  if(props.usedNumbers.indexOf(number) >=0){
   return 'used';
  }
   if(props.selectedNumbers.indexOf(number) >=0){
   return 'selected';
  }
}
  return(
  <div className="card text-center">
   <div>
   {Numbers.list.map((number,i) =>
    <span key={i} className={numberClassName(number)}
    onClick={() => props.selectedNumber(number)}
    >{number}</span>
   )}
   </div>
  </div>
  );
}

Numbers.list =  _.range(1,10);

class Game extends React.Component {
static randomNumber = () => 1+ Math.floor(Math.random()*9);
static initialState = ()  => ({
	selectedNumbers:[],
  randomNumberOfstars: Game.randomNumber(),
  answerIsCorrect:null,
  usedNumbers:[],
   redraws:5,
   doneStatus:null,
});
state = Game.initialState();
resetGame = () => this.setState(Game.initialState());
selectedNumber = (clickedNumber) => {

  if(this.state.selectedNumbers.indexOf(clickedNumber)>=0) {return ;}
  this.setState(prevState => ({
   answerIsCorrect:null,
  selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
  }));
}
unselectNumber = (clickedNumber)  => {
 answerIsCorrect:null;
  this.setState(prevState => ({
   answerIsCorrect:null,
  selectedNumbers:prevState.selectedNumbers.filter(number => number !== clickedNumber)
  }));
}
acceptAnswer = () => {
this.setState(prevState =>({
usedNumbers:prevState.usedNumbers.concat(prevState.selectedNumbers),
selectedNumbers:[],
 answerIsCorrect:null,
 randomNumberOfstars:  Game.randomNumber(),

}), this.updateDoneStatus);
}

redraw = () => {
if(this.state.redraws === 0) {return ;}
this.setState(prevState => ({
  randomNumberOfstars:  Game.randomNumber(),
  answerIsCorrect:null,
  selectedNumbers:[],
  redraws:prevState.redraws-1,
}), this.updateDoneStatus);
}

possibleSolutions = ({randomNumberOfstars,usedNumbers}) => {
const possibleNumbers  = _.range(1,10).filter(number =>
usedNumbers.indexOf(number)=== -1);
return possibleCombinationSum(possibleNumbers,randomNumberOfstars);
};

updateDoneStatus = () => {
	this.setState(prevState => {
  	if(prevState.usedNumbers.length === 9){
     return {doneStatus:'Done Nice!'};
    }
    if(prevState.redraws === 0 && !this.possibleSolutions(prevState))
    {
    	return {doneStatus:"Game Over !"};
    }
  });
}

checkAnswer = () => {
this.setState(prevState => ({
answerIsCorrect: prevState.randomNumberOfstars === 
prevState.selectedNumbers.reduce((acc,n) =>  acc + n ,0)
}));
}
  render(){
  const {randomNumberOfstars,
  selectedNumbers,
  usedNumbers,
  redraws,
  doneStatus,
  answerIsCorrect}=this.state;
    return(
    <div className="container">
    <h3> Play Nine</h3>
    <hr/>
      <div className="row">
       <Stars randomNumberOfstars={randomNumberOfstars} />
        <Button  selectedNumbers={selectedNumbers} 
        checkAnswer ={this.checkAnswer}
        acceptAnswer={this.acceptAnswer}
        answerIsCorrect={answerIsCorrect}
        redraws={redraws}
        redraw={this.redraw}
        />
       <Answer selectedNumbers={selectedNumbers} 
              unselectNumber={this.unselectNumber}/>
      </div>
      <br/>
      {
      doneStatus ?
       <Doneframe resetGame={this.resetGame}
       doneStatus={doneStatus} /> :
       <Numbers selectedNumbers={selectedNumbers}
       usedNumbers={usedNumbers}
       				selectedNumber={this.selectedNumber}/>
      }
       
     
    </div>
    );
  }
}

class App extends React.Component {
  render(){
    return(
    <div>
    <Game/>
    </div>
    );
  }
}


ReactDOM.render(<App/>,mountNode);