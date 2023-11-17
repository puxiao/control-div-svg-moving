import { useState } from 'react'

import './index.scss'

const points = "M250,66.5H172.2V17.8S173.6,2,158.3.1H54.7s-10-1.8-11.9,8.8v9.2s.1,7.1,8.7,6.2h60s4.9-.8,6.6,7,5.2,24.9,5.2,24.9,1.6,6.4-6.6,7.7H59.9s-5.2-.7-6,6.6V90.3s2.6,13.6-26,22.7c0,0-21.7,5.2-24,7.8,0,0-9.9,10.8,1.8,25.2H24.5s4.8,1.3,5.7-6.1L30,127.1s.2-5.4,7.4-4.7l24.2.3s4.8,0,5.7-5.7l-.2-20.1s-.5-4.5,5.9-5.4H94.1l13.3,3.3H125s5.9-.6,7.1,7.9l8.8,38.3s2.1,8.7-9.1,7.7H43.1s-7-1.3-7.2,8.8v27.2s-1,5.2,6.1,11.7c0,0,30.3,25.9,53,33.6h70.4s7.7,1,7-8.9l-.2-144.5" //所有的路径关键点
const length = 1000 //我们虚构一个路径长度，通过在 svg 中向 path 添加 pathLength 属性来强制曲线长度为我们设定的 1000

const SVGAnimation = () => {
    const [num, setNum] = useState<number>(38)
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNum(Number(event.target.value))
    }
    return (
        <div>
            <div className='over-icon' style={{ offsetDistance: `${num}%` }}></div>
            <svg className='both-svg over-svg' viewBox="0 0 250 230">
                <path d={points} pathLength={length} style={{ strokeDasharray: length, strokeDashoffset: length * (1 - num / 100) }} />
            </svg>
            <svg className='both-svg' viewBox="0 0 250 230">
                <path d={points} />
            </svg>
            <h5>当前进度百分比：{num}</h5>
            <input type='range' value={num} min="0" max="100" step='1' onChange={handleInputChange} />
        </div>
    )
}

export default SVGAnimation
