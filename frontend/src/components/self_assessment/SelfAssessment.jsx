import React, { useState, useRef, useEffect } from "react";
import styles from "./SelfAssessment.module.css";

function SelfAssessment() {
  const [textArray, setTextArray] = useState(Array(7).fill(""));
  const textAreaRefs = useRef([]);

  const handleInput = (index, e) => {
    const newTextArray = [...textArray];
    newTextArray[index] = e.target.value;
    setTextArray(newTextArray);
  };

  useEffect(() => {
    textArray.forEach((text, index) => {
      if (textAreaRefs.current[index]) {
        textAreaRefs.current[index].style.height = "auto";
        textAreaRefs.current[index].style.height =
          `${textAreaRefs.current[index].scrollHeight}px`;
      }
    });
  }, [textArray]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement submit logic here
    console.log("Submitted data:", textArray);
  };

  return (
    <div className={styles.assHandler}>
      <div className={styles.banner}>
        <h1>Welcome to Self-Assessment</h1>
        <p>Your feedback is valuable!</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.card}>
          Please respond with only your responses and no one elses!
        </div>
        {textArray.map((text, index) => (
          <div key={index} className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              Temporary text, under review.
            </label>
            <textarea
              className={styles.inputField}
              placeholder="what is 1+1 equal to?..."
              value={text}
              onInput={(e) => handleInput(index, e)}
              ref={(el) => (textAreaRefs.current[index] = el)}
              rows="1"
            />
          </div>
        ))}
        <button type="submit" className={styles.submitButton}>
          提交
        </button>
      </form>
    </div>
  );
}

export default SelfAssessment;
