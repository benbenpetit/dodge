import './style.scss'

const canvas = document.querySelector('.js-canvas')
const ctx = canvas.getContext('2d')
const scoreRef = document.querySelector('.js-score')

let width = (canvas.width = window.innerWidth)
let height = (canvas.height = window.innerHeight)

let mouseX = width / 2
let mouseY = height / 2

let blockHeight = 16
let frequency = 1
let speed = 10

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

let score = 0
let timer = setInterval(() => {
  score++
  scoreRef.innerHTML = score
}, 30)

let isDefeat = false

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

const cursorChecker = () => {
  const currentMouse = {
    x: mouseX,
    y: mouseY
  }

  lines.forEach((line) => {
    line.forEach((block) => {
      if (
        currentMouse.x > block.x &&
        currentMouse.x < block.x + block.width &&
        currentMouse.y > block.y &&
        currentMouse.y < block.y + block.height
      ) {
        clearInterval(timer)
        isDefeat = true
      }
    })
  })
}

const updateBlocks = (line) => {
  if (line[0].y > height + blockHeight) {
    lines.shift()
    frequency += 0.1
    speed++
    clearInterval(interval)
    interval = setInterval(() => {
      setupLine(columns)
    }, 1000 / frequency)
  }

  line.forEach((block) => {
    block.y += speed

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
  if (!isDefeat) {
    ctx.clearRect(0, 0, width, height)
    updateLines()
  }

  updateCursor()
  cursorChecker()

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
