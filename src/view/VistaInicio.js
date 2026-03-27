import * as BABYLON from '@babylonjs/core'
import * as GUI from '@babylonjs/gui'
import { VistaTutorial } from './VistaTutorial.js'

export class VistaInicio {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas = canvas

    /** @type {BABYLON.Engine} */
    this.engine = new BABYLON.Engine(canvas, true)

    /** @type {BABYLON.Scene | null} */
    this.scene = null

    /** @type {GUI.AdvancedDynamicTexture | null} */
    this.gui = null

    /** @type {VistaTutorial | null} */
    this.vistaTutorial = null

    /** @type {(() => void) | null} */
    this.onTutorial = null
  }

  crearEscena() {
    const scene = new BABYLON.Scene(this.engine)

    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      Math.PI / 2,
      Math.PI / 2,
      10,
      BABYLON.Vector3.Zero(),
      scene
    )
    camera.attachControl(this.canvas, true)

    new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(0, 1, 0),
      scene
    )

    const gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI', true, scene)
    this.gui = gui

    this.vistaTutorial = new VistaTutorial(gui)
    this.vistaTutorial.crear()

    /**
     * @param {string} texto
     * @param {string} top
     * @param {() => void} callback
     */
    const crearBoton = (texto, top, callback) => {
      const boton = GUI.Button.CreateSimpleButton(texto, texto)

      boton.width = '200px'
      boton.height = '50px'
      boton.color = 'white'
      boton.background = 'blue'
      boton.top = top
      boton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER

      boton.onPointerUpObservable.add(callback)

      gui.addControl(boton)
    }

    crearBoton('Tutorial', '-60px', () => {
      if (this.onTutorial) {
        this.onTutorial()
      }
    })

    this.scene = scene
  }

  /**
   * @param {() => void} callback
   */
  setOnTutorial(callback) {
    this.onTutorial = callback
  }

  render() {
    this.crearEscena()

    if (!this.scene) return

    this.engine.runRenderLoop(() => {
      this.scene.render()
    })

    window.addEventListener('resize', () => {
      this.engine.resize()
    })
  }
}
