import { useState } from 'react'

import './index.scss'

const points = "M20,20 C20,100 200,0 200,100" //所有的路径关键点
const length = 230 //路径总长度

const SVGAnimation = () => {
    const [num, setNum] = useState<number>(1)
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNum(Number(event.target.value))
    }
    return (
        <div>
            <div className='over-icon' style={{ offsetDistance: `${num}%` }}></div>
            <svg className='both-svg over-svg' viewBox="0 0 280 150">
                <path d={points} style={{ strokeDasharray: length, strokeDashoffset: `${100 - num}%` }} />
            </svg>
            <svg className='both-svg' viewBox="0 0 280 150">
                <path d={points} />
            </svg>
            <h5>当前进度百分比：{num}</h5>
            <input type='range' value={num} min="1" max="100" step='1' onChange={handleInputChange} />
        </div>
    )
}

export default SVGAnimation