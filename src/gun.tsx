import  { useCallback, 
    // useMemo,
     useRef, useState } from 'react'
import './App.css';
const ourDebounce = (fn,delay)=>{
        let timer;
        return (...args)=>{
            clearTimeout(timer);
            timer = setTimeout(()=>{
                fn(...args);
            }, delay)
        };
    }
const throttle = (fn,delay)=>{
    let timer;
    return (...args)=>{
        if(!timer){
            fn(...args);
            timer = setTimeout(()=>{
                timer = null;
            },delay)
        }
    }
}
function Gun() {
    // const [search,setSearch] = useState();
    const [normalBullet, setNormalBullet] = useState(0)
    const [debounceBullet, setDebounceBullet] = useState(0)
    const [throttleBullet, setThrottleBullet] = useState(0)
    const debounceCount = useRef(0);
    const throttleCount = useRef(0);
    const handleChangeDebounce = ()=>{
        // setSearch(e.target.value)
        setDebounceBullet(debounceCount.current)
    }

    const handleChangeThrottle = ()=>{
        setThrottleBullet(throttleCount.current)
    }

    // const debouncedChange = useMemo(()=>ourDebounce(handleChangeDebounce,300),[])
    // const throttledChange = useMemo(()=>throttle(handleChangeThrottle,300),[])

    const debouncedChange = useCallback(ourDebounce(handleChangeDebounce,300),[])
    const throttledChange = useCallback(throttle(handleChangeThrottle,300),[])

  return (
    <div>
        {/* <input type="text" onChange={debouncedChange} />
        <div>{search}</div> */}
        <div className='container'>
            <div onClick={()=>setNormalBullet(prev=>prev+1)} className="gun normal-gun"></div>
            <div className="bullet"></div>
            <div>normal bullet: {normalBullet}</div>
        </div>

        <div className='container'>
            <div onClick={()=>{debounceCount.current +=1; debouncedChange();}} className="gun debounce-gun"></div>
            <div className="bullet"></div>
            <div>debounce bullet: {debounceBullet}</div>
        </div>

        <div className='container'>
            <div onClick={()=>{throttleCount.current +=1; throttledChange();}} className="gun throttle-gun"></div>
            <div className="bullet"></div>
            <div>throttle bullet: {throttleBullet}</div>
        </div>
    </div>
  )
}

export default Gun;