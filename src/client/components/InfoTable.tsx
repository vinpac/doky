import * as React from 'react'

interface InfoTableProps {
  readonly className?: string
}

const InfoTable: React.SFC<
  InfoTableProps & { [key: string]: string | number }
> = ({ className, ...props }) => (
  <table className={`Doky__InfoTable${className ? ` ${className}` : ''}`}>
    <tbody>
      {Object.keys(props).map(propKey => (
        <tr key={propKey}>
          <td className="Doky__InfoTableLabel">{propKey}</td>
          <td>{props[propKey]}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

InfoTable.displayName = 'InfoTable'

export default InfoTable
