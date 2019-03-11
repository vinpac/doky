export default (input: string) => {
  let spans = ''
  input.split('\n').forEach((_, i) => {
    spans += `<span>${i + 1}</span>`
  })

  return `<span class="Doky__CodeLineNumbers">${spans}</span>`
}
