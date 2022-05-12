import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, Text, Platform} from 'react-native';

import Button from './src/components/Button';
import Display from './src/components/Display';

const initialState = {
  displayValue: '0',
  clearDisplay: false,
  operation: null,
  values: [0, 0],
  current: 0,
};

export default class App extends Component {
  state = {...initialState};

  addDigit = n => {
    const clearDisplay =
      //vai limpar o display quando digitar um número. Por exemplo, se digitar 8, não vai ficar 08
      this.state.displayValue === '0' || this.state.clearDisplay; // é verdadeiro

    if (n === '.' && !clearDisplay && this.state.displayValue.includes('.')) {
      return;
    }

    // o valor corrente é vazio quando preciso limpar o display, senão é exatamente o valor que estou digitando
    const currentValue = clearDisplay ? '' : this.state.displayValue;
    // concatenar números (strings)
    const displayValue = currentValue + n;
    // muda as variáveis do estado inicial
    this.setState({displayValue, clearDisplay: false});

    if (n !== '.') {
      const newValue = parseFloat(displayValue);
      const values = [...this.state.values];
      values[this.state.current] = newValue;
      this.setState({values});
    }
  };

  clearMemory = () => {
    this.setState({...initialState});
  };

  setOperation = operation => {
    if (this.state.current === 0) {
      // quando digitamos o primeiro operando, irá mudar o state
      this.setState({operation, current: 1, clearDisplay: true});
    } else {
      const equals = operation === '=';
      const values = [...this.state.values];
      try {
        values[0] = eval(`${values[0]} ${this.state.operation} ${values[1]}`);
      } catch (e) {
        values[0] = this.state.values[0];
      }

      values[1] = 0;
      this.setState({
        displayValue: `${values[0]}`,
        operation: equals ? null : operation,
        current: equals ? 0 : 1,
        // clearDisplay: !equals,
        clearDisplay: true,
        values,
      });
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Display value={this.state.displayValue}></Display>
        <SafeAreaView style={styles.buttons}>
          <Button label="AC" triple onClick={this.clearMemory} />
          <Button label="/" operation onClick={this.setOperation} />
          <Button label="7" onClick={this.addDigit} />
          <Button label="8" onClick={this.addDigit} />
          <Button label="9" onClick={this.addDigit} />
          <Button label="*" operation onClick={this.setOperation} />
          <Button label="4" onClick={this.addDigit} />
          <Button label="5" onClick={this.addDigit} />
          <Button label="6" onClick={this.addDigit} />
          <Button label="-" operation onClick={this.setOperation} />
          <Button label="1" onClick={this.addDigit} />
          <Button label="2" onClick={this.addDigit} />
          <Button label="3" onClick={this.addDigit} />
          <Button label="+" operation onClick={this.setOperation} />
          <Button label="0" double onClick={this.addDigit} />
          <Button label="." onClick={this.addDigit} />
          <Button label="=" operation onClick={this.setOperation} />
        </SafeAreaView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
