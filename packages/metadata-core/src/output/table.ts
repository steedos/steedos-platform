const COLUMN_SEPARATOR = '  ';
const COLUMN_FILLER = ' ';
const HEADER_FILLER = '─';

export interface Row {
  [column: string]: string;
}

export interface Column {
  key: string;
  label: string;
}

export class Table {
  public createTable(rows: Row[], cols: Column[], title?: string): string {
    if (!rows) {
      throw Error('rows cannot be undefined');
    }
    if (!cols) {
      throw Error('columns cannot be undefined');
    }
    const maxColWidths = this.calculateMaxColumnWidths(rows, cols);
    let table = title ? `=== ${title}` : '';

    let columnHeader = '';
    let headerSeparator = '';
    cols.forEach((col, index, arr) => {
      const width = maxColWidths.get(col.key);
      if (width) {
        const isLastCol = index === arr.length - 1;
        columnHeader += this.fillColumn(
          col.label || col.key,
          width,
          COLUMN_FILLER,
          isLastCol
        );
        headerSeparator += this.fillColumn('', width, HEADER_FILLER, isLastCol);
      }
    });
    if (columnHeader && headerSeparator) {
      table += `${title ? '\n' : ''}${columnHeader}\n${headerSeparator}\n`;
    }

    rows.forEach(row => {
      let outputRow = '';
      cols.forEach((col, colIndex, colArr) => {
        const cell = row[col.key];
        const isLastCol = colIndex === colArr.length - 1;
        const rowWidth = outputRow.length;
        cell.split('\n').forEach((line, lineIndex) => {
          const cellWidth = maxColWidths.get(col.key);
          if (cellWidth) {
            if (lineIndex === 0) {
              outputRow += this.fillColumn(
                line,
                cellWidth,
                COLUMN_FILLER,
                isLastCol
              );
            } else {
              // If the cell is multiline, add an additional line to the table
              // and pad it to the beginning of the current column
              outputRow +=
                '\n' +
                this.fillColumn('', rowWidth, COLUMN_FILLER, isLastCol) +
                this.fillColumn(line, rowWidth, COLUMN_FILLER, isLastCol);
            }
          }
        });
      });
      table += outputRow + '\n';
    });

    return table;
  }

  private calculateMaxColumnWidths(rows: Row[], cols: Column[]) {
    const maxColWidths = new Map<string, number>();
    cols.forEach(col => {
      rows.forEach(row => {
        const cell = row[col.key];
        if (cell === undefined) {
          throw Error(`Row is missing the key ${col.key}`);
        }

        let maxColWidth = maxColWidths.get(col.key);
        if (maxColWidth === undefined) {
          maxColWidth = (col.label || col.key).length;
          maxColWidths.set(col.key, maxColWidth);
        }

        // if a cell is multiline, find the line that's the longest
        const longestLineWidth = cell
          .split('\n')
          .reduce((maxLine, line) =>
            line.length > maxLine.length ? line : maxLine
          ).length;
        if (longestLineWidth > maxColWidth) {
          maxColWidths.set(col.key, longestLineWidth);
        }
      });
      if(typeof maxColWidths.get(col.key) === 'undefined'){
        maxColWidths.set(col.key, col.key.length + 10);
      }
    });
    return maxColWidths;
  }

  private fillColumn(
    label: string,
    width: number,
    filler: string,
    isLastCol: boolean
  ): string {
    let filled = label;
    for (let i = 0; i < width - label.length; i++) {
      filled += filler;
    }
    if (!isLastCol) {
      filled += COLUMN_SEPARATOR;
    }
    return filled;
  }
}
