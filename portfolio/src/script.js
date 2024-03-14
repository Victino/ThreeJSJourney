import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import earthVertexShader from './shaders/earth/vertex.glsl'
import earthFragmentShader from './shaders/earth/fragment.glsl'
import atmosphereVertexShader from './shaders/atmosphere/vertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphere/fragment.glsl'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const textureLoader = new THREE.TextureLoader()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(20, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 15
scene.add(camera)

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()
const rayOrigin = new THREE.Vector3(- 3, 0, 0)
const rayDirection = new THREE.Vector3(10, 0, 0)
rayDirection.normalize()


/**
 * Mouse
 */
const mouse = new THREE.Vector2()

// Update the position of the circle based on mouse movement
window.addEventListener('mousemove', (event) => {
    // Update the mouse position
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;

    // Update the raycaster
    raycaster.setFromCamera(mouse, camera);

    // Raycast to get intersection point
    const backgroundObjects = [background]
    const intersects = raycaster.intersectObjects(backgroundObjects);
    if (intersects.length > 0) {
        // Set circle position to intersection point
        circle.position.copy(intersects[0].point);
    }
});

// Previous mouse position
let prevMouse = { x: 0, y: 0 };

// Camera position offset
const cameraOffset = { x: 0, y: 0 };

// Update the position of the circle based on mouse movement
window.addEventListener('mousemove', (event) => {
    // Update the mouse position
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;

    // Calculate change in mouse position
    const deltaMouse = {
        x: mouse.x - prevMouse.x,
        y: mouse.y - prevMouse.y
    };

    // Adjust the camera position offset based on change in mouse position
    const cameraSpeed = 0.1;
    cameraOffset.x -= deltaMouse.x * cameraSpeed;
    cameraOffset.y -= deltaMouse.y * cameraSpeed;

    // Apply camera position offset
    camera.position.x = cameraOffset.x;
    camera.position.y = cameraOffset.y;

    // Update previous mouse position
    prevMouse = { x: mouse.x, y: mouse.y };
});


// Mouse Circle
const circleGeometry = new THREE.SphereGeometry(0.1, 32)
const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xd00000 });
const circle = new THREE.Mesh(circleGeometry, circleMaterial);
circle.position.x = -10;
scene.add(circle);


// Background
const background = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshBasicMaterial({opacity: 0, transparent: true})
)
background.position.z = -10
scene.add(background)


/**
 * Earth
 */
const earthParameters = {}
earthParameters.atmosphereDayColor = '#00aaff'
earthParameters.atmosphereTwilightColor = '#1127ee'


// Earth Textures
const earthDayTexture = textureLoader.load('./earth/day.jpg')
earthDayTexture.colorSpace = THREE.SRGBColorSpace
earthDayTexture.anisotropy = 8

const earthNightTexture = textureLoader.load('./earth/night.jpg')
earthNightTexture.colorSpace = THREE.SRGBColorSpace
earthNightTexture.anisotropy = 8

const earthSpecularCloudsTexture = textureLoader.load('./earth/specularClouds.jpg')
earthSpecularCloudsTexture.anisotropy = 8

// Earth Mesh
const earthGeometry = new THREE.SphereGeometry(2, 64, 64)
const earthMaterial = new THREE.ShaderMaterial({
    vertexShader: earthVertexShader,
    fragmentShader: earthFragmentShader,
    uniforms:
    {
        uDayTexture: new THREE.Uniform(earthDayTexture),
        uNightTexture: new THREE.Uniform(earthNightTexture),
        uSpecularCloudsTexture: new THREE.Uniform(earthSpecularCloudsTexture),
        uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0.2, 0.5)),
        uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
        uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor))
    }
})
const earth = new THREE.Mesh(earthGeometry, earthMaterial)
scene.add(earth)

// Atmosphere
const atmosphereMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    uniforms:
    {
        uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
        uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
        uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor))
    },
})

const atmosphere = new THREE.Mesh(earthGeometry, atmosphereMaterial)
atmosphere.scale.set(1.04, 1.04, 1.04)
scene.add(atmosphere)


atmosphere.position.x = 3
earth.position.x = 3




// // Torus
// const geometry4 = new THREE.TorusGeometry(0.8, 0.05, 8, 50)
// const material4 = new THREE.MeshBasicMaterial({ color: 0xffffff })
// const torus = new THREE.Mesh(geometry4, material4)
// torus.position.y = 2
// scene.add(torus)

// Asteroid ground planet
// const planetGeometry = new THREE.SphereGeometry(3, 32, 32)
// const planetMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff })
// const asteroidGround = new THREE.Mesh(planetGeometry, planetMaterial)
// asteroidGround.position.y = -2
// asteroidGround.position.x = 3
// scene.add(asteroidGround)




// Particles
// Geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 500

const positions = new Float32Array(count * 1000)

for(let i = 0; i < count; i++)
{
    positions[i] = (Math.random() - 0.5) * 20
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)


// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor( 0x000000, 0 ); // the default


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // torus.rotation.y = elapsedTime * 1
    // torus.rotation.x = elapsedTime * 1

    // Update Earth's rotation
     earth.rotation.y = elapsedTime * -0.1

    // Animate camera
    camera.position.y = -scrollY * 0.002

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()