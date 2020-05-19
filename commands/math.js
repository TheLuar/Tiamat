'use strict'

const operations = {
    '**': (x, y) => x ** y,
    '^': (x, y) => x ** y,
    '*': (x, y) => x * y,
    '/': (x, y) => x / y,
    '+': (x, y) => x + y,
    '-': (x, y) => x - y,
}

const operators = Object.keys(operations)
const functions = ['sin', 'asin', 'asinh', 'cos', 'acos', 'acosh', 'log', 'sqrt', 'cbrt', 'random', 'round', 'ceil', 'floor']

const consts = {
	PI: Math.PI,
	E: Math.E,
	Infinity: Infinity,
}

const solveOperations = input =>
{
    input = input.replace(/\s+/g, '')

    for (const o of operators)
    {
		const escapedO = o.split('').join('\\')
        const re = new RegExp('(-|)([\\d]+\\.[\\d]+|[\\d]+)\\' + escapedO + '(-|)([\\d]+\\.[\\d]+|[\\d]+)')
                
        while (re.test(input))
        {
            const m = input.match(re)[0]
            const nums = m.split(o)
            const result = operations[o](Number(nums[0]), Number(nums[1]))
            input = input.replace(m, result)
        }
    }

    return input
}

const solveFunctions = input =>
{
	const funRE = /(\w+)\(([^(]*?)\)/

	while (funRE.test(input))
	{
		const m = input.match(funRE)
		const f = functions.includes(m[1]) ? Math[m[1]] : (x => x)
		const res = math(m[2])
		input = input.replace(m[0], f(res))
	}

	return input	
}


const parseConsts = input =>
{
	for (const con in consts)
	{
		input = input.replace(new RegExp(con, 'g'), consts[con])
	}
	return input
}

const math = (input = '') =>
{
	return solveOperations(solveFunctions(parseConsts(input)))
}

module.exports = (msg, args) =>
{
	const input = args.join('')
	
	let result = math(input)

	try
	{
		result = BigInt(result)
	}
	catch (err) {}

	msg.channel.send(result)
}
