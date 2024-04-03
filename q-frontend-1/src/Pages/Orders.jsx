export default function Orders() {
  let now = new Date()
  now.setFullYear(now.getFullYear() - 3)
  let formattedDate = Math.floor(now.getTime() / 1000)
  console.log(now.getTime())
  console.log(formattedDate);
  return (
    <>
      <div>Orders</div>
      <p>{formattedDate}</p>
    </>
  )
}
