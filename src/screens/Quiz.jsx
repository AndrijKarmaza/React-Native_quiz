import { StyleSheet, Text, ImageBackground } from "react-native";
import questions from "../data/questions";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import ModalVindow from "../components/ModalVindow";
import QuestionCard from "../components/QuestionCard";
import Progress from "../components/Progress";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Quiz = () => {
  const [currQuestIndex, setCurrQuestIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [isButtonActive, setIsButtonActive] = useState(true);
  const [isNextButtonVisible, setIsNextButtonVisible] = useState(false);
  const [isModalvisible, setIsModalVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [result, setResult] = useState([]);

  const length = questions.length;

  useEffect(() => {
    async function settingDataToStorage() {
      try {
        await AsyncStorage.setItem("result", JSON.stringify(result));
      } catch (error) {}
    }
    settingDataToStorage();
  }, [result]);

  const checkAnswer = (answer) => {
    correct = questions[currQuestIndex]["correct_answer"];
    setCorrectAnswer(correct);
    setSelectedAnswer(answer);
    setIsButtonActive(false);
    answer === correct && setScore(score + 1);
    setIsNextButtonVisible(true);
  };

  const defaulSetting = () => {
    setSelectedAnswer(null);
    setCorrectAnswer(null);
    setIsButtonActive(true);
    setIsNextButtonVisible(false);
    setIsResultVisible(false);
  };

  const onNextBtnPress = () => {
    setCurrQuestIndex(currQuestIndex + 1);
    defaulSetting();
  };

  const onResultBtnPress = () => {
    setIsModalVisible(true);
    setResult([...result, score]);
  };

  const newGamePlay = () => {
    defaulSetting();
    setIsModalVisible(false);
    setCurrQuestIndex(0);
    setScore(0);
  };

  const seeResult = () => {
    setIsResultVisible(true);
  };

  return (
    <ImageBackground
      source={require("../../assets/images/bg_image.jpg")}
      resizeMode="cover"
      style={styles.bg_image}
    >
      {!isModalvisible && (
        <>
          <Progress currQuestIndex={currQuestIndex} length={length} />
          <QuestionCard
            currQuestIndex={currQuestIndex}
            correctAnswer={correctAnswer}
            selectedAnswer={selectedAnswer}
            checkAnswer={checkAnswer}
            isButtonActive={isButtonActive}
          />
          {currQuestIndex === questions.length - 1 && isNextButtonVisible ? (
            <Button
              text={"Подивитись результат"}
              onBtnPress={onResultBtnPress}
            />
          ) : (
            isNextButtonVisible && (
              <Button text={"Наступне питання"} onBtnPress={onNextBtnPress} />
            )
          )}
        </>
      )}

      {isModalvisible && (
        <ModalVindow
          score={score}
          isVisible={isModalvisible}
          onBtnPress={newGamePlay}
          isResultVisible={isResultVisible}
          seeResult={seeResult}
        />
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg_image: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 50,
  },
});

export default Quiz;