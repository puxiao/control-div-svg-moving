# offset-distance-and-stroke-dashoffset

使用 JS 控制 Div + SVG 不规则轨迹运动进度的简单示例。



#### 示例演示效果

![demo](https://www.puxiao.com/demo/offset-distance-and-stroke-dashoffset/offset-distance-and-stroke-dashoffset-demo.jpg)



**Demo:** https://www.puxiao.com/demo/offset-distance-and-stroke-dashoffset/

滑动块中的数值代表当前不规则轨迹中，方块位置的百分比，修改该值后，方块和方块下面的黄色线条会响应移动和变化。

<br/>

#### 实现思路

上图中，除 修改当前百分比状态的输入框外，一共有 3 个元素

1. 一个 div 的黄色方块

2. 一个 svg 的黄色线条

3. 一个 svg 的灰色线条

   > 灰色线条实际上是当做静止不动的背景来使用的，因此我们不做过多讨论。



假设我们现在已经知道 “轨迹” 路径为："M20,20 C20,100 200,0 200,100"，当前百分比值为 num，那么我们需要分别做以下设定。

黄色方块 div：

1. 通过 css 样式 offset-path: path("M20,20 C20,100 200,0 200,100") 来规定他移动的轨迹
2. 通过 css 样式 offset-distance: num% 来规定当前他所移动的轨迹位置



黄色线条 svg：

1. 通过 svg 属性 d={"M20,20 C20,100 200,0 200,100"} 来规定这个 svg 的路径
2. 通过 css 样式 stroke-dasharray 来定义 线段虚线的长度
3. 通过 css 样式 stroke-dashoffset 来定义 线段虚线的偏移
4. 通过 css 样式 stroke:  yellow 设置线条颜色



灰色线条 svg：

1. 通过 svg 属性 d={"M20,20 C20,100 200,0 200,100"} 来规定这个 svg 的路径
2. 通过 css 属性 stroke: #cccccc 设置线条颜色



假设当前进度百分比 num 发生了变化，实际上仅仅需要动态重新定义一下：

1、黄色方块 div 的 offset-distance 值为 num%

2、黄色线条 svg.path 的 stroke-dashoffset  值为 (100-num)%



简单来说，整个效果其实就是由 2 个 css 属性值变动最终形成的。



**黄色方块 div 通过 offset-path、offset-distance 实现了动画。**

**黄色线条 svg 通过 svg.path 的 d 属性、stroke-dasharray、stroke-dashoffset 实现了动画。**

<br/>



#### 具体的代码

特别说明：以下代码是使用 React 17.0.1、TypeScript 编写的。



**主页面**

./src/index.tsx

```
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
```

> const length = 230 //路径总长度
>
> <path d={points} style={{ strokeDasharray: length ...}} />
>
> 这里面的运动轨迹总长度 230 是我们经过不断试验最终得出的。
>
> 这个值过小则会出现在 100% 时黄色线条依然无法完全覆盖住底部灰色轨迹；
>
> 这个值过大则会出现在 1% 时黄色线条显示过多；

<br/>

**CSS文件**

./src/index.scss

```
.over-icon {
    offset-path: path('M20,20 C20,100 200,0 200,100');
    offset-rotate: 0deg;
    width: 10px;
    height: 10px;
    position: absolute;
    background: yellow;
}

.both-svg {
    width: 280px;
    height: 150px;
}

.both-svg path {
    stroke-width: 2px;
    fill: none;
    stroke: #cccccc;
}

.over-svg {
    position: absolute;
}

.over-svg path {
    stroke: yellow;
}


h5 {
    margin: 10px;
    color: white;
}

input {
    display: block;
    margin: 20px 10px 10px;
    width: 220px;
}
```

> 注意：offset-rotate: 0deg; 属性设置后，无论运动轨道是否发生弧度，黄色方块永远不会旋转角度。
>
> 若去掉该属性，则黄色方块会随着目标运动轨道的弧度而相应调整自身的旋转角度。

<br/>

#### 知识补充：svg.path 的 d 属性值的一些知识

d 属性值包含了 所有的路径关键点和连接关键点的贝塞尔曲线等关键信息。

| 关键点信息示例                                        | 对应详细解释               |
| ----------------------------------------------------- | -------------------------- |
| M = moveto(M X,Y)                                     | 将画笔移动到指定的坐标位置 |
| L = lineto(L X,Y)                                     | 画直线到指定的坐标位置     |
| H = horizontal lineto(H X)                            | 画水平线到指定的X坐标位置  |
| V = vertical lineto(V Y)                              | 画垂直线到指定的Y坐标位置  |
| C = curveto(C X1,Y1,X2,Y2,ENDX,ENDY)                  | 三次贝赛曲线               |
| S = smooth curveto(S X2,Y2,ENDX,ENDY)                 | 平滑曲率                   |
| Q = quadratic Belzier curve(Q X,Y,ENDX,ENDY)          | 二次贝赛曲线               |
| T = smooth quadratic Belzier curveto(T ENDX,ENDY)     | 映射                       |
| A = elliptical Arc(A RX,RY,XROTATION,FLAG1,FLAG2,X,Y) | 弧线                       |
| Z = closepath()                                       | 关闭路径                   |



**svg 的属性**

1. viewBox：可见矩形区域
2. width：宽
3. height：高



**svg.path 的其他属性值**

1. fill：内容颜色
2. stroke：边框颜色
3. stroke-width：边框线条宽度(粗细)
4. transform="translate(x,y)" 加边框后需要平移 (x=stroke-width/2, y=stroke-width/2)

注意，对于 svg 相关宽度和坐标坐标而言，单位值就是数字本身，不需要加其他内容(例如 "px")。

<br/>

#### 补充阅读

在编写本示例时，以下 3 篇文章对我帮助很大，推荐阅读：



1. 张鑫旭：offset-path元素沿着路径运动CSS实现实例

   https://www.zhangxinxu.com/study/201702/offset-path-css-animation.html

   

2. MDN关于 offset-distance 属性介绍

   https://developer.mozilla.org/en-US/docs/Web/CSS/offset-distance

   

3. SVG路径动画简易指南

   https://www.w3cplus.com/svg/svg-animation-guide.html
   
   
