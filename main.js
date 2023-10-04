import gsap from 'gsap'
import './style.scss'

const canvas = document.querySelector('.js-canvas')
const ctx = canvas.getContext('2d')

let width = (canvas.width = window.innerWidth)
let height = (canvas.height = window.innerHeight)

let mouseX = width / 2
let mouseY = height / 2

let frequency = 3
let speed = 12

let circle = {
  radius: 10,
  lastX: mouseX,
  lastY: mouseY
}

let columns = 5
let gap = 16
let lines = []

let interval = setInterval(() => {
  setupLine(columns)
}, 1000 / frequency)

const onResize = () => {
  width = canvas.width = window.innerWidth
  height = canvas.height = window.innerHeight
}

const updateCursor = () => {
  circle.lastX = lerp(circle.lastX, mouseX, 0.35)
  circle.lastY = lerp(circle.lastY, mouseY, 0.35)

  ctx.beginPath()
  ctx.arc(circle.lastX, circle.lastY, circle.radius, 0, Math.PI * 2, false)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.closePath()
}

const setupLine = (columns = 5) => {
  const rand = Math.floor(Math.random() * columns)
  const blockWidth = (width - gap * (columns - 1)) / columns
  const blockHeight = 16
  let blocks = []

  for (let i = 0; i < columns; i++) {
    const x = i * (blockWidth + gap)

    blocks.push({
      x: x,
      y: 0,
      width: blockWidth,
      height: blockHeight
    })
  }

  blocks.splice(rand, 1)
  lines.push(blocks)
}

const updateBlocks = (line) => {
  line.forEach((block, i) => {
    block.y += speed

    if (block.y > height) {
      lines.pop()
    }

    ctx.beginPath()
    ctx.rect(block.x, block.y, block.width, block.height)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    ctx.closePath()
  })
}

const updateLines = () => {
  lines.forEach(line => {
    updateBlocks(line)
  })
}

const render = () => {
  ctx.clearRect(0, 0, width, height)

  updateCursor()
  updateLines()

  requestAnimationFrame(render)
}

const init = () => {
  requestAnimationFrame(render)

  window.addEventListener('mousemove', (e) => {
    mouseX = e.pageX
    mouseY = e.pageY
  })

  window.addEventListener('resize', onResize, false)
}

const lerp = (a, b, n) => {
  return (1 - n) * a + n * b
}

init()
