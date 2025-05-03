/**
 * 📝 registerApp
 *
 * Starts a Sparkle app by running its initial render and calling setup.
 * Used to activate an app after it has been created via createApp().
 *
 * @param {object} app - The app instance
 * @param {object} app.appRef - The reactive state signal
 * @param {function} app.render - The render function to project state to DOM
 * @param {function} [app.setup] - Optional setup function to wire events
 *
 * @example
 * import { createApp } from './runtime/createApp.js'
 * import { registerApp } from './runtime/registerApp.js'
 *
 * const { appRef, render, setup } = createApp({...})
 * registerApp({ appRef, render, setup })
 */
export const registerApp = ({ appRef, render, setup }) => {
	// 🖼 Render the app's initial state
	render(appRef.value)

	// 🔌 Run event wiring if provided
	if (typeof setup === 'function') setup()
}
