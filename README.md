# offset-distance-and-stroke-dashoffset

使用 JS 控制 Div + SVG 不规则轨迹运动进度的简单示例。



#### 示例演示效果

![demo](https://www.puxiao.com/demo/offset-distance-and-stroke-dashoffset/offset-distance-and-stroke-dashoffset-demo.jpg)



**Demo:** https://www.puxiao.com/demo/offset-distance-and-stroke-dashoffset/

滑动块中的数值代表当前不规则轨迹中方块位置的百分比，修改该值后，方块和方块下面的黄色线条会相应移动和变化。

<br/>



#### 实现思路

1. 先得到目标图形的路径数据
2. 再实现 JS + CSS 控制目标运动轨迹

下面讲解一下具体过程。



#### 1、路径数据来源

路径数据，即 svg.path.d 的值，获得该路径数据的途径为：

**第1步：** 在矢量软件 AI 也就是 Illistrator 中，通过钢笔工具绘制出我们需要的路径。

有几点需要注意：

1. 需要将 标尺单位 设置为 像素

2. 根据将来需要使用的实际大小，按照 1:1 尺寸来绘制

   >  最终调整时，尽量避免尺寸包含小数点

3. 在导出 SVG 文件的选项中

   1.  不使用画板
   2. 小数保留 1 位即可



**第2步：** 使用网页或者记事本，打开刚才保存好的 .svg 格式文件

1. 找到 svg 中 path 的 d 的值，该值即为我们所需要的路径数据
2. 该 svg 中其他样式、代码、属性设置等，我们一概不需要



假设我们得到的路径数据为：

M250,66.5H172.2V17.8S173.6,2,158.3.1H54.7s-10-1.8-11.9,8.8v9.2s.1,7.1,8.7,6.2h60s4.9-.8,6.6,7,5.2,24.9,5.2,24.9,1.6,6.4-6.6,7.7H59.9s-5.2-.7-6,6.6V90.3s2.6,13.6-26,22.7c0,0-21.7,5.2-24,7.8,0,0-9.9,10.8,1.8,25.2H24.5s4.8,1.3,5.7-6.1L30,127.1s.2-5.4,7.4-4.7l24.2.3s4.8,0,5.7-5.7l-.2-20.1s-.5-4.5,5.9-5.4H94.1l13.3,3.3H125s5.9-.6,7.1,7.9l8.8,38.3s2.1,8.7-9.1,7.7H43.1s-7-1.3-7.2,8.8v27.2s-1,5.2,6.1,11.7c0,0,30.3,25.9,53,33.6h70.4s7.7,1,7-8.9l-.2-144.5'

<br/>



#### 2、交互实现思路

交互的核心部分一共有 3 个元素

1. 一个 div 的黄色方块

2. 一个 svg 的黄色线条

3. 一个 svg 的灰色线条




假设我们现在已经知道 “轨迹” 路径为："M250,66.5H172.2V17.8S173.6,2,......"，当前百分比值为 num，那么我们需要分别做以下设定。

黄色方块 div：

1. 通过 css 样式 offset-path: path("M250,66.5H172.2V17.8S173.6,2,......") 来设置他移动的轨迹
2. 通过 css 样式 offset-distance: num% 来设置当前他所移动的轨迹位置



黄色线条 svg：

1. 通过 svg 属性 d={"M250,66.5H172.2V17.8S173.6,2,......"} 来设置这个 svg 的路径

2. 通过 css 样式 stroke-dasharray 来定义 线段虚线的长度

   > 注意：路径是弯曲的，所以我们只能不断通过试验(猜测)，才能得到一个相对精准点的路径总长度
   >
   > 具体做法是：先将 stroke-dashoffset 的值设置为 0，然后不断修改 stroke-dasharray 的值，直到该值恰好完整覆盖掉 灰色 svg 线条，那么这个值就是该路径总长度。
   >
   > 由于  svg 是矢量的，所以该长度并没有单位，只是一个数字而已。
   >
   > 在本示例中，路径的总长度为 1240

3. 通过 css 样式 stroke-dashoffset 来定义 线段虚线的偏移

4. 通过 css 样式 stroke:  yellow 设置线条颜色



灰色线条 svg：

1. 通过 svg 属性 d={"M250,66.5H172.2V17.8S173.6,2,......"} 来设置这个 svg 的路径
2. 通过 css 属性 stroke: #cccccc 设置线条颜色



我们先定义路径总长度：

```
const length = 1240
```

假设当前进度百分比 num 发生了变化，实际上仅仅需要动态重新定义一下：

1. 黄色方块 div 的 offset-distance 值为 num%

2. 黄色线条 svg.path 的 stroke-dashoffset  值为 length * (1 - num / 100)

   > 当 num 为 0 时，虚线间隔 等于 虚线的长度，呈现出的结果就是 黄色线条完全不显示，灰色线条没有被遮挡
   >
   > 当 num 为 1 时，虚线间隔 等于 0，呈现出的结果就是 黄色线条完全显示出来，刚好完全覆盖住 灰色线条



简单来说，整个效果其实就是由 2 个 css 属性值变动最终形成的。



**黄色方块 div 通过 offset-path、offset-distance 实现了动画。**

**黄色线条 svg 通过 svg.path 的 d 属性、stroke-dasharray、stroke-dashoffset 实现了动画。**

<br/>



#### 具体的代码

特别说明：以下代码是使用 React 17.0.1、TypeScript、Scss 编写的。



**主页面**

./src/index.tsx

```
import { useState } from 'react'

import './index.scss'

const points = "M250,66.5H172.2V17.8S173.6,2,158.3.1H54.7s-10-1.8-11.9,8.8v9.2s.1,7.1,8.7,6.2h60s4.9-.8,6.6,7,5.2,24.9,5.2,24.9,1.6,6.4-6.6,7.7H59.9s-5.2-.7-6,6.6V90.3s2.6,13.6-26,22.7c0,0-21.7,5.2-24,7.8,0,0-9.9,10.8,1.8,25.2H24.5s4.8,1.3,5.7-6.1L30,127.1s.2-5.4,7.4-4.7l24.2.3s4.8,0,5.7-5.7l-.2-20.1s-.5-4.5,5.9-5.4H94.1l13.3,3.3H125s5.9-.6,7.1,7.9l8.8,38.3s2.1,8.7-9.1,7.7H43.1s-7-1.3-7.2,8.8v27.2s-1,5.2,6.1,11.7c0,0,30.3,25.9,53,33.6h70.4s7.7,1,7-8.9l-.2-144.5" //所有的路径关键点
const length = 1240 //路径总长度

const SVGAnimation = () => {
    const [num, setNum] = useState<number>(38)
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNum(Number(event.target.value))
    }
    return (
        <div>
            <div className='over-icon' style={{ offsetDistance: `${num}%` }}></div>
            <svg className='both-svg over-svg' viewBox="0 0 250 230">
                <path d={points} style={{ strokeDasharray: length, strokeDashoffset: length * (1 - num / 100) }} />
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
```



<br/>

**CSS文件**

./src/index.scss

```
.over-icon {
    offset-path: path('M250,66.5H172.2V17.8S173.6,2,158.3.1H54.7s-10-1.8-11.9,8.8v9.2s.1,7.1,8.7,6.2h60s4.9-.8,6.6,7,5.2,24.9,5.2,24.9,1.6,6.4-6.6,7.7H59.9s-5.2-.7-6,6.6V90.3s2.6,13.6-26,22.7c0,0-21.7,5.2-24,7.8,0,0-9.9,10.8,1.8,25.2H24.5s4.8,1.3,5.7-6.1L30,127.1s.2-5.4,7.4-4.7l24.2.3s4.8,0,5.7-5.7l-.2-20.1s-.5-4.5,5.9-5.4H94.1l13.3,3.3H125s5.9-.6,7.1,7.9l8.8,38.3s2.1,8.7-9.1,7.7H43.1s-7-1.3-7.2,8.8v27.2s-1,5.2,6.1,11.7c0,0,30.3,25.9,53,33.6h70.4s7.7,1,7-8.9l-.2-144.5');
    offset-rotate: 0deg;
    width: 10px;
    height: 10px;
    position: absolute;
    background: yellow;
}

.both-svg {
    width: 250px;
    height: 231px;
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
    width: 230px;
}
```



请注意上面样式中的 `offset-rotate: 0deg;` 无论运动轨道是否发生弧度变化，黄色方块永远不会旋转角度。

若去掉该样式，则黄色方块会随着目标运动轨道的弧度而相应调整自身的旋转角度。

<br/>



你也可以把 黄色方块 对应的样式属性 offset-path 从 css 中移除，改为在代码中赋值：

```diff
- <div className='over-icon' style={{ offsetDistance: `${num}%` }}></div>

+ <div className='over-icon' style={{ offsetDistance: `${num}%`, offsetPath: `path('${points}')` }}></div>
```

> 我上面的代码中把 offset-path 放在了 css 中，是因为我想在调试过程中减少干扰，更好的去观察 offsetDistance 属性值的变化。



至此，本示例讲解完毕。



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
   
   
