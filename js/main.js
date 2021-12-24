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

        console.log('Sí hay datos')

        const anios = data.map(dato => dato['Año'])

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -200)
            .attr('y', 80)
            .text('Salario mínimo en México')

        svg.append('text')
            .attr('x', width / 2 + 120)
            .attr('y', height + 50)
            .text(`Sí jala este pedo (Max: ${d3.max(anios)}, Min: ${d3.min(anios)})`)
            .attr('class', 'info')

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(anios)])
        const xAxis = d3.axisBottom()
        const yAxis = 2

        svg.select('.visHolder')
            .append('g')

    } catch (error) {
        console.error(error)
    }
}

init()