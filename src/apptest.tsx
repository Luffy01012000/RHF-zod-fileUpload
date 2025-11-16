import { useState } from 'react';

const Apptest = () => {
    const [count, setCount] = useState(0);
    const startTimer = ()=>{
        setInterval(()=>{
            const newCount = count + 1;
            // debugger;
            console.log(newCount)
            setCount(newCount);
        },500)
    }
  return (
    <div>
        <p>Count: {count}</p>
        <button onClick={startTimer}>Start Timer</button>
    </div>
  )
}

export default Apptest