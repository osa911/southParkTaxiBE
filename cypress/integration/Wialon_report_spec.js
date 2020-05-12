const URL = '?lang=ru'
const login = 'evgeniy9137'
const password = 'Osadchuy911'

describe('South Park', () => {
  describe('Wialon messages', () => {
    it('makes report and save it to file', () => {
      cy.visit(URL)
      cy.get('#login_body').then(($el) => {
        console.log('$el.attr(\'style\')> ', $el.attr('style'))
        if (Cypress.dom.isAttached($el) && $el.attr('style') !== 'display: none') {
          cy.get('#user').type(login)
          cy.get('#passw').type(password)
          cy.get('#submit').click()
        }
      })
      cy.server()
      cy.route('GET', '/wh_newsbox/?lang=ru&group=1&onlyinfo=1').as('get_wh_newsbox')
      cy.wait('@get_wh_newsbox', { timeout: 20000 })
      cy.get('#hb_mi_messages').click()
      cy.get('#time_from_messages_filter_time_interval').clear().type('04 Май 2020 00:00').blur()
      cy.get('#time_to_messages_filter_time_interval').clear().type('10 Май 2020 23:59').blur()
      cy.get('#messages_filter_interval_execute').click()
      cy.wait(1000)

      const statistics = []
      cy.get('.msgs-stat-table tbody>tr').each((el) => {
        const row = Cypress.$(el)
        const label = row.find('span').text()
        const value = row.find('td').text()
        statistics.push({ label, value })
      })

      cy.get('#messages_table_content_table select#rp.wui-select').select('1000')
      cy.wait(500)
      let tableCols, tableRows = []
      cy.get('#messages_table_content_table .hDivBox>table>thead>tr').each((el) => {
        const row = Cypress.$(el)
        tableCols = [...row.children()].reduce((list, el) => {
          const colKey = el.getAttribute('data-col-id')
          const colName = Cypress.$(el).find('span').text()
          return [...list, { key: colKey, label: colName }]
        }, [])
      })

      cy
        .get('#messages_table_content_table .bDiv>table>tbody')
        .children()
        .each((el) => {
          const row = Cypress.$(el)
          const columns = [...row.children()].reduce((list, el, key) => {
            const colName = Cypress.$(el).find('span').text()
            return [...list, { [tableCols[key].key]: colName }]
          }, [])
          tableRows = [...tableRows, columns]
        })
        .then(() => {
          const date = new Date()
          const dateString = date.toLocaleDateString().replace(/\//g, '_')
          const time = date.toLocaleTimeString()
          const report = {
            statistics,
            report: {
              columns: tableCols,
              rows: tableRows
            }
          }
          cy.writeFile(`./messages/${dateString}_${time}_log.json`, report)
        })
    })
  })

  describe('Wialon report', () => {
    it('makes report and save it to file', () => {
      // cy.get('#dPanel-top #hb_mi_reports_ctl').click()
      // cy.get('#time_from_report_templates_filter_time').clear().type('04 Май 2020 00:00').blur()
      // cy.get('#time_to_report_templates_filter_time').clear().type('10 Май 2020 23:59').blur()
      // cy.get('#report_templates_filter_params_execute').click()
      // const date = new Date()
      // const dateString = date.toLocaleDateString().replace(/\//g, '_')
      // const time = date.toLocaleTimeString()
      // const report = { statistics }
      // cy.writeFile(`./reports/${dateString}_${time}_log.json`, report)
    })
  })
})
