import { StatusBar } from 'expo-status-bar';
import React, { Component, useState }  from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Button } from 'react-native';
import Constants from "expo-constants";
import Modal, { ModalTitle, ModalContent, SlideAnimation, ModalButton, ModalFooter} from 'react-native-modals';
const CHOICES = [
  {
    name: 'rock',
    uri: 'http://pngimg.com/uploads/stone/stone_PNG13622.png'
  },
  {
    name: 'paper',
    uri: 'https://www.stickpng.com/assets/images/5887c26cbc2fc2ef3a186046.png'
  },
  {
    name: 'scissors',
    uri:
      'http://pluspng.com/img-png/png-hairdressing-scissors-beauty-salon-scissors-clipart-4704.png'
  }
];
const SecButton = props => (
  <TouchableOpacity
    style={styles.buttonStyle}
    onPress={() => props.onPress(props.name)}
  >
    <Text style={styles.buttonText}>
      {props.name.charAt(0).toUpperCase() + props.name.slice(1)}
    </Text>
  </TouchableOpacity>
);
const ChoiceCard = ({ player, choice: { uri, name } }) => {
  const title = name && name.charAt(0).toUpperCase() + name.slice(1);
  return (
    <View style={styles.choiceContainer}>
      <Text style={styles.choiceDescription}>{player}</Text>
      <Image source={{ uri }} resizeMode="contain" style={styles.choiceImage} />
      <Text style={styles.choiceCardTitle}>{title}</Text>
    </View>
  );
};
const getRoundOutcome = userChoice => {
  const computerChoice = randomComputerChoice().name;
  let result;

  if (userChoice === 'rock') {
    result = computerChoice === 'scissors' ? 'Victory!' : 'Defeat!';
  }
  if (userChoice === 'paper') {
    result = computerChoice === 'rock' ? 'Victory!' : 'Defeat!';
  }
  if (userChoice === 'scissors') {
    result = computerChoice === 'paper' ? 'Victory!' : 'Defeat!';
  }

  if (userChoice === computerChoice) result = 'Tie game!';
  return [result, computerChoice];
};
const randomComputerChoice = () =>
  CHOICES[Math.floor(Math.random() * CHOICES.length)];

const cal = (a, b) =>{
  const percen = a/b*100;
  return percen.toFixed(2);
}

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gamePrompt: 'Choose your weapon!',
      userChoice: {},
      computerChoice: {}, 
      total: 0,
      win: 0,
      lose: 0,
      tied: 0,
      popup: false,
    }
  }
  onPress = playerChoice => {
    const [result, compChoice] = getRoundOutcome(playerChoice);
    const newUserChoice = CHOICES.find(choice => choice.name === playerChoice);
    const newComputerChoice = CHOICES.find(choice => choice.name === compChoice);
  
    this.setState({
      gamePrompt: result,
      userChoice: newUserChoice,
      computerChoice: newComputerChoice
    })
    if(result==="Victory!"){
      this.setState(state => {return {win: this.state.win+1}})
    } else if(result === "Defeat!"){
      this.setState(state => {return {lose: this.state.lose+1}})
    } else if(result === "Tie game!"){
      this.setState(state => {return {tied: this.state.tied+1}})
    }
    this.setState({
      total: this.state.win + this.state.lose + this.state.tied,
    })
  };
  getResultColor = () => {
    if (this.state.gamePrompt === 'Victory!') return 'green';
    if (this.state.gamePrompt === 'Defeat!') return 'red';
    return null;
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 30, paddingBottom: 10, color: this.getResultColor() }}>{this.state.gamePrompt}</Text>
       <View style={styles.choicesContainer}>
        <ChoiceCard
          player="Player"
          choice={this.state.userChoice}
        />
        <Text style={{ color: '#250902', fontSize: 20, }}>vs</Text>
        <ChoiceCard
          player="Computer"
          choice={this.state.computerChoice}
        />
      </View>
      {CHOICES.map(choice => {
        return <SecButton key={choice.name} 
        name={choice.name} onPress={this.onPress} />;
        })
      }   
      <Button
            title="View your statistic!"
            onPress={() => {
              this.setState({
                popup: true,
              });
            }}
          />

      <Modal 
          onDismiss={() => {
            this.setState({ popup: false });
          }}
          // onTouchOutside={() => {
          //   this.setState({ popup: false });
          // }}
          swipeDirection="down"
          // onSwipeOut={() => this.setState({ popup: false })}
          visible={this.state.popup}
          modalTitle={
            <ModalTitle
              title="Your statistic"
              hasTitleBar={false}
            />
          }
          modalAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
        >
          <ModalContent>
            <View style={styles.ratingBar}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>Total games</Text>
                <Text style={{fontSize: 20}}>{this.state.total}</Text>
            </View>
              <View style={styles.ratingBar}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>Win</Text>
                <Text style={{fontSize: 15}}>{this.state.win}</Text>
              </View>
              <View style={styles.ratingBar}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>Lose</Text>
                <Text style={{fontSize: 15}}>{this.state.lose}</Text>
              </View>
              <View style={styles.ratingBar}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>Tied</Text>
                <Text style={{fontSize: 15}}>{this.state.tied}</Text>
              </View>
              <View>
                <Text>Win percentage: {`${cal(this.state.win, this.state.total)}`}%</Text>
                <Text>Lose percentage: {`${cal(this.state.lose, this.state.total)}`}%</Text>
                <Text>Tied percentage: {`${cal(this.state.tied, this.state.total)}`}%</Text>
              </View>
          </ModalContent>
          <ModalFooter>
            <ModalButton text="Back" onPress={() => {
                  this.setState({ popup: false });
                }} key="button-1"
              />
              <ModalButton text="Reset" onPress={() => {
                  this.setState({
                    gamePrompt: 'Choose your weapon!',
                    userChoice: {},
                    computerChoice: {}, 
                    total: 0,
                    win: 0,
                    lose: 0,
                    tied: 0,
                    popup: false, 
                  });
                }} key="button-2"
              />
              </ModalFooter>
          
        </Modal>
     
      </View>
    );
  }
}

  
const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e9ebee'
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    width: 200,
    margin: 10,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#640D14',
  },
  buttonText: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
  },
  choicesContainer: {
    // margin: 10,
    borderWidth: 2,
    paddingTop: 25,
    shadowRadius: 5,
    paddingBottom: 25,
    borderColor: 'grey',
    shadowOpacity: 0.90,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'space-around',
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { height: 5, width: 5 },
  },
  choiceContainer: {
    flex: 1,
    alignItems: 'center',
  },
  choiceDescription: {
    fontSize: 25,
    color: '#250902',
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  choiceCardTitle: {
    fontSize: 30,
    color: '#250902'
  },
  choiceImage: {
    width: 150,
    height: 150,
    padding: 10,
  },
  ratingBar: {
    // flex: 1,
    alignItems: 'center',
    // marginBottom: 3,
    marginVertical: 5,
  },
});