import { Suspense, use, useState, useTransition } from 'react'
import * as ReactDOM from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
// 💰 you're gonna want this:
import { useSpinDelay } from 'spin-delay'
import { getImageUrlForShip, getShip } from './utils.tsx'

function App() {
	console.log(`App component logic start`)

	const [shipName, setShipName] = useState('Dreadnought')
	// 🐨 rename this to isTransitionPending
	const [isTransitionPending, startTransition] = useTransition()
	// 🐨 create an isPending based on what you get back from useSpinDelay
	const isPending = useSpinDelay(isTransitionPending, { delay: 300, minDuration: 350 })

	function handleShipSelection(newShipName: string) {
		console.log('cb startTransition called')

		startTransition(() => {
			setShipName(newShipName)
		})
	}

	console.log(`App component rendering`)

	return (
		<div className="app-wrapper">
			<ShipButtons shipName={shipName} onShipSelect={handleShipSelection} />
			<div className="app">
				<div className="details" style={{ opacity: isPending ? 0.6 : 1 }}>
					<ErrorBoundary fallback={<ShipError shipName={shipName} />}>
						<Suspense fallback={<ShipFallback shipName={shipName} />}>
							<ShipDetails shipName={shipName} />
						</Suspense>
					</ErrorBoundary>
				</div>
			</div>
		</div>
	)
}

function ShipButtons({
	shipName,
	onShipSelect,
}: {
	shipName: string
	onShipSelect: (shipName: string) => void
}) {
	console.log(`ShipButtons component logic start`)

	const ships = ['Dreadnought', 'Interceptor', 'Galaxy Cruiser']

	console.log(`ShipButtons component rendering`)

	return (
		<div className="ship-buttons">
			{ships.map((ship) => (
				<button
					key={ship}
					onClick={() => onShipSelect(ship)}
					className={shipName === ship ? 'active' : ''}
				>
					{ship}
				</button>
			))}
		</div>
	)
}

function ShipDetails({ shipName }: { shipName: string }) {
	console.log(`ShipDetails logic start`)
	
	// 💯 Set different delays for different ships. Feel free to play around with the values.
	const delay = shipName === 'Interceptor' ? 200 : shipName === 'Galaxy Cruiser' ? 400 : 10
	
	const ship = use(getShip(shipName, delay))
	
	console.log(`ShipDetails component rendering`)

	return (
		<div className="ship-info">
			<div className="ship-info__img-wrapper">
				<img
					src={getImageUrlForShip(ship.name, { size: 200 })}
					alt={ship.name}
				/>
			</div>
			<section>
				<h2>
					{ship.name}
					<sup>
						{ship.topSpeed} <small>lyh</small>
					</sup>
				</h2>
			</section>
			<section>
				{ship.weapons.length ? (
					<ul>
						{ship.weapons.map((weapon) => (
							<li key={weapon.name}>
								<label>{weapon.name}</label>:{' '}
								<span>
									{weapon.damage} <small>({weapon.type})</small>
								</span>
							</li>
						))}
					</ul>
				) : (
					<p>NOTE: This ship is not equipped with any weapons.</p>
				)}
			</section>
			<small className="ship-info__fetch-time">{ship.fetchedAt}</small>
		</div>
	)
}

function ShipFallback({ shipName }: { shipName: string }) {
	console.log(`ShipFallback component logic start`)

	console.log(`ShipFallback component rendering`)

	return (
		<div className="ship-info">
			<div className="ship-info__img-wrapper">
				<img src="/img/fallback-ship.png" alt={shipName} />
			</div>
			<section>
				<h2>
					{shipName}
					<sup>
						XX <small>lyh</small>
					</sup>
				</h2>
			</section>
			<section>
				<ul>
					{Array.from({ length: 3 }).map((_, i) => (
						<li key={i}>
							<label>loading</label>:{' '}
							<span>
								XX <small>(loading)</small>
							</span>
						</li>
					))}
				</ul>
			</section>
		</div>
	)
}

function ShipError({ shipName }: { shipName: string }) {
	console.log(`ShipError component logic start`)

	console.log(`ShipError component rendering`)

	return (
		<div className="ship-info">
			<div className="ship-info__img-wrapper">
				<img src="/img/broken-ship.webp" alt="broken ship" />
			</div>
			<section>
				<h2>There was an error</h2>
			</section>
			<section>There was an error loading "{shipName}"</section>
		</div>
	)
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)
