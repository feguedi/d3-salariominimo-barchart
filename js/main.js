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

        const data = await getSalarioMinimo()

        const anios = data.map(dato => dato['Año'])
        const salarios = data.map(dato => Number(String(dato['Salario mínimo real']).replace(',', '.')) || 0)

        svg.append('text')
            .attr('x', width - (width / 2) - 80)
            .attr('y', height + 20)
            .text('Fuente: https://www.datos.gob.mx/busca/dataset/salario-minimo-historico-1877-2019')
            .attr('class', 'info')

        svg.append('text')
            .attr('x', width - (width / 2) - 50)
            .attr('y', height + 50)
            .text('Nota: entre los años 1879 a 1885 y entre 1912 a 1933 no hay datos registrados')
            .attr('class', 'info')

        const salarioMaximo = d3.max(salarios)
        const linearScale = d3.scaleLinear()
            .domain([0, salarioMaximo])
            .range([height, 0])

        const salariosEscalados = salarios.map(salario => linearScale(salario))

        const xScale = d3.scaleLinear()
            .domain([d3.min(anios), d3.max(anios)])
            .range([padding, width - padding])

        const xAxis = d3.axisBottom()
            .scale(xScale)
        const yAxisScale = d3.scaleLinear()
            .domain([padding, salarioMaximo])
            .range([height - padding, 0])
        const yAxis = d3.axisLeft(yAxisScale)

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
            .attr('fill', 'rgb(10, 205, 10)')
            .attr('x', (d, i) => xScale(anios[i]))
            .attr('y', d => d)
            .attr('width', `${barWidth}px`)
            .attr('height', (d, i) => Math.max(0, height - padding - d))
            .attr('index', (d, i) => i)
            .attr('transform', `translate(${padding}, 0)`)
            .on('mouseover', function(event, d) {
                const i = this.getAttribute('index')

                overlay.transition()
                    .duration(0)
                    .style('height', `${Math.max(0, height - padding - d)}px`)
                    .style('width', `${barWidth}px`)
                    .style('opacity', 0.9)
                    .style('left', `${xScale(anios[i])}px`)
                    .style('top', `${d}px`)
                    .style('transform', `translateX(${padding}px)`)

                tooltip.transition()
                    .duration(200)
                    .style('opacity', 0.9)

                tooltip.html(`${anios[i]}<br>$${salarios[i]} MXN`)
                    .attr('data-date', data[i]['Año'])
                    .style('left', `${xScale(anios[i]) + 30}px`)
                    .style('top', `${height - 100}px`)
                    .style('transform', `translateX(${padding}px)`)
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