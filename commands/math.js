'use strict'

const vars = {}

const sciNotation = /(-|)\d+\.\d+e\d+/i

const operations = {
	'e': (x, y) => x * (1 + '0'.repeat(Number(y) || 0)),
    '**': (x, y) => x ** y,
    '^': (x, y) => x ** y,
    '*': (x, y) => x * y,
    '/': (x, y) => x / y,
    '+': (x, y) => x + y,
	'-': (x, y) => x - y,
}

const operators = Object.keys(operations)
const functions = ['hypot', 'tan', 'atan', 'atan2', 'atanh', 'sin', 'asin', 'asinh', 'cos', 'acos', 'acosh', 'log', 'sqrt', 'cbrt', 'random', 'round', 'ceil', 'floor']

const consts = {
	π: Math.PI,
	pi: Math.PI,
	e: Math.E,
	infinity: Infinity,
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
	const brace = /\(([^(]*?)\)/
	const funct = /(\w+)\(([^(]*?)\)/

	while (brace.test(input))
	{
		if (funct.test(input))
		{
			const m = input.match(funct)
			let res = math(m[2])
			if (functions.includes(m[1])) res = Math[m[1]](...res.split(','))
			input = input.replace(m[0], res)
		}
		else
		{
			const m = input.match(brace)
			const res = math(m[1])
			input = input.replace(m[0], res)
		}
	}

	return input	
}

const parseConsts = input =>
{
	for (const con in consts)
	{
		const p = '(^|\s|[^a-z0-9])'
		const s = '($|\s|[^a-z0-9])'
		const re = new RegExp(p + con + s, 'ig')
		input = input.replace(re, '$1' + consts[con] + '$2')
	}
	return input
}

const parseVars = input =>
{
	for (const con in vars)
	{
		const p = '(^|\s|[^a-z0-9])'
		const s = '($|\s|[^a-z0-9])'
		const re = new RegExp(p + con + s, 'ig')
		input = input.replace(re, '$1' + vars[con] + '$2')
	}
	return input
}

const math = (input = '0') =>
{
	return solveOperations(solveFunctions(parseConsts(parseVars(input))))
}

module.exports = (msg, args) =>
{
	if (args.includes('--v'))
	{
		let txt = ''
		for (const v in vars) txt += v + ' = ' + vars[v] + '\n'
		msg.channel.send(txt ? '```js\n' + txt + '```' : 'Empty.')
		return
	}

	if (args.includes('--c'))
	{
		for (const v in vars) delete vars[v]
		msg.channel.send('Deleted vars.')
		return
	}

	const input = args.join('').split('=')
	const response = []
	
	let assign = ''
	let result = ''

	if (input.length > 1)
	{
		assign = input[0]
		result = math(input[1])
	}
	else
	{
		result = math(input[0])
	}

	const fail = result !== 'NaN' && isNaN(result)

	if (fail)
	{
		response.push('Could not solve:')
		response.push(result)
	}
	else
	{
		response.push('=')

		if (isFinite(result) && sciNotation.test(result))
		{
			response.push(BigInt(Number(result)))
		}
		else
		{
			response.push(Number(result))
		}
	
		if (assign) vars[assign] = response[response.length - 1]
	}

	msg.channel.send(response.join(' '))
}

// module.exports = (msg, args) =>
// {
// 	let response = ''

// 	const input = args.join('').split('=')
	
// 	const result   = input.length > 1 ? math(input[1]) : input[0]
// 	const variable = input.length > 1 ? input[0] : '0'

// 	const fail = result !== 'NaN' && isNaN(result)

// 	if (fail)
// 	{
// 		response += ('Could not solve:')
// 		response += (result)
// 	}
// 	else
// 	{
// 		response += ('=')

// 		if (isFinite(result) && sciNotation.test(result))
// 		{
// 			response += (BigInt(Number(result)))
// 		}
// 		else
// 		{
// 			response += (result || 0)
// 		} 
// 	}
	
// 	if (variable)
// 	{
// 		vars[variable]
// 	}

// 	msg.channel.send(response)
// }
