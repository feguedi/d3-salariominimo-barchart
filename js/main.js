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
        const salarioMaximo = d3.max(salarios)
        const linearScale = d3.scaleLinear()
            .domain([0, salarioMaximo])
            .range([height, 0])

        const salariosEscalados = salarios.map(salario => linearScale(salario))

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

        d3.select('svg')
            .selectAll('rect')
            .data(salariosEscalados)
            .enter()
            .append('rect')
            .attr('data-date', (d, i) => new Date(data[i]['Año'], 1))
            .attr('data-salario', (d, i) => Number(String(data[i]['Salario mínimo real']).replace(',', '.')) || 0)
            .attr('class', 'bar')
            .attr('x', (d, i) => xScale(anios[i]))
            .attr('y', d => height - d)
            .attr('width', barWidth)
            .attr('height', d => d)
            .attr('index', (d, i) => i)
            .attr('transform', 'translate(60, 0)')
            .on('mouseover', function(event, d) {
                const i = this.getAttribute('index')

                overlay.transition()
                    .duration(0)
                    .style('height', d + 'px')
                    .style('width', barWidth + 'px')
                    .style('opacity', 0.9)
                    .style('left', i * barWidth + 0 + 'px')
                    .style('top', height - d + 'px')
                    .style('transform', 'translateX(60px)')

                tooltip.transition()
                    .duration(200)
                    .style('opacity', 0.9)

                tooltip.html(`${anios[i]}<br>$${salarios[i]} MXN`)
                    .attr('data-date', data[i]['Año'])
                    .style('left', `${i * barWidth + 30}px`)
                    .style('top', `${height - 100}px`)
                    .style('transform', 'translateX(60px)')
            })
            .on('mouseout', () => {
                tooltip.transition().duration(200).style('opacity', 0)
                overlay.transition().duration(200).style('opacity', 0)
            })

    } catch (error) {
        console.error(error)
    }
}

init()