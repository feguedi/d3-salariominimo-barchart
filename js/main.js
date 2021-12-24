async function getSalarioMinimo() {
    try {
        const request = await fetch('data/salario-minimo.json')
        const data = request.json()
        return data
    } catch (error) {
        console.error(error)
    }
}

async function init() {
    try {
        // const salarioMinimoData = []
        const width = 800
        const height = 400
        const padding = 30
        const barWidth = width / 275

        const tooltip = d3.select('.visHolder')
            .append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0)

        const overlay = d3.select('.visHolder')
            .append('div')
            .attr('class', 'overlay')
            .style('opacity', 0)

        const svg = d3.select('.visHolder')
            .append('svg')
            .attr('width', width + 100)
            .attr('height', height + 60)
            .style('background-color', 'pink')

        const data = await getSalarioMinimo()

        const anios = data.map(dato => dato['Año'])
        const salarios = data.map(dato => Number(String(dato['Salario mínimo real']).replace(',', '.')) || 0)

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -300)
            .attr('y', 80)
            .text('Salario mínimo en México')

        const xScale = d3.scaleLinear()
            .domain([d3.min(anios), d3.max(anios)])
            .range([padding, width - padding])

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(salarios)])
            .range([height - padding, padding])

        const xAxis = d3.axisBottom()
            .scale(xScale)
        const yAxis = d3.axisLeft()
            .scale(yScale)

        svg.append('g')
            .attr('transform', `translate(${padding}, ${height - padding})`)
            .attr('id', 'x-axis')
            .call(xAxis)

        svg.append('g')
            .attr('transform', `translate(${padding * 2}, 0)`)
            .attr('id', 'y-axis')
            .call(yAxis)

    } catch (error) {
        console.error(error)
    }
}

init()