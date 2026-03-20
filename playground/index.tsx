import { Suspense } from 'react'
import * as ReactDOM from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import { getImageUrlForShip, getShip, type Ship } from './utils.tsx'

// const shipName = 'Dreadnought'
// 🚨 If you want to to test out the error state, change this to 'Dreadyacht'
const shipName = 'Dreadyacht'

function App() {
	console.log(`App component logic start`)

	console.log(`App component rendering`)
	
	return (
		<div className="app-wrapper">
			<div className="app">
				<div className="details">
					<ErrorBoundary fallback={<ShipError />}>
						<Suspense fallback={<ShipFallback />}>
							<ShipDetails />
						</Suspense>
					</ErrorBoundary>
				</div>
			</div>
		</div>
	)
}

let ship: Ship
let error: unknown
// 🐨 create a status variable here
let status: 'pending' | 'fulfilled' | 'rejected' = 'pending'
const shipPromise = getShip(shipName).then(
	(result) => {
		ship = result
		// 🐨 set the status to 'fulfilled'
		status = 'fulfilled'
	},
	(err) => {
		error = err
		// 🐨 set the status to 'rejected'
		status = 'rejected'
	},
)

function ShipDetails() {
	console.log(`ShipDetails component logic start`)

	// 🐨 change this condition to if the status is rejected
	if (status === 'rejected') 
		throw error
	// 🐨 change this condition to if the status is pending
	if (status === 'pending') 
		throw shipPromise

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

function ShipFallback() {
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

function ShipError() {
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
