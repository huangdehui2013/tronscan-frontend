/* eslint-disable no-undef */
import React from "react";
import {connect} from "react-redux";
import {head} from "lodash";
import {Link, NavLink, Route, Switch} from "react-router-dom";
import {Client} from "../../../services/api";
import {tu, tv} from "../../../utils/i18n";
import TimeAgoI18N from "../../common/TimeAgoI18N";
import {FormattedDate, FormattedNumber, FormattedTime} from "react-intl";
import {AddressLink, BlockHashLink, BlockNumberLink} from "../../common/Links";
import {CopyText} from "../../common/Copy";
import {TronLoader} from "../../common/loaders";
import {Truncate} from "../../common/text";
import Contract from "../../tools/TransactionViewer/Contract";
import {ContractTypes} from "../../../utils/protocol";

class Transaction extends React.Component {

  constructor() {
    super();

    this.state = {
      loading: true,
      transaction: {
        hash: -1,
        timestamp: 0,
      },
      tabs: {
        contracts: {
          id: "contracts",
          icon: "fa fa-exchange-alt",
          path: "",
          label: <span>{tu("contracts")}</span>,
          cmp: () => <TronLoader/>,
        }
      },
    };
  }

  componentDidMount() {
    let {match} = this.props;
    this.load(match.params.hash);
  }

  componentDidUpdate(prevProps) {
    let {match} = this.props;

    if (match.params.hash !== prevProps.match.params.hash) {
      this.load(match.params.hash);
    }
  }

  async load(id) {

    this.setState({ loading: true, transaction: { hash: id } });

    let transaction = await Client.getTransactionByHash(id);

    this.setState({
      loading: false,
      transaction,
      tabs: {
        contracts: {
          id: "contracts",
          icon: "fa fa-exchange-alt",
          path: "",
          label: <span>{tu("contracts")}</span>,
          cmp: () => (
            <Contract contract={{
              ...transaction.contractData,
              contractType: ContractTypes[transaction.contractType],
            }}/>
          ),
        },
      }
    });
  }

  render() {

    let {transaction, tabs, loading} = this.state;
    let {match} = this.props;

    return (
      <main className="container header-overlap">
        {
          loading ? <div className="card">
            <TronLoader>
              Loading Transaction
            </TronLoader>
          </div> :
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title text-center m-0">
                      {transaction.hash}
                    </h5>
                  </div>
                  <table className="table table-hover m-0">
                    <tbody>
                      <tr>
                        <th>{tu("Status")}:</th>
                        <td>
                          {
                            transaction.confirmed ?
                              <span className="badge badge-success text-uppercase">Confirmed</span> :
                              <span className="badge badge-danger text-uppercase">Unconfirmed</span>
                          }
                        </td>
                      </tr>
                    <tr>
                      <th>{tu("hash")}:</th>
                      <td>
                        <Truncate>
                          {transaction.hash}
                          <CopyText text={transaction.hash} className="ml-1" />
                        </Truncate>
                      </td>
                    </tr>
                    <tr>
                      <th>{tu("block")}:</th>
                      <td><BlockNumberLink number={transaction.block} /></td>
                    </tr>
                    {
                      transaction.timestamp !== 0 && <tr>
                        <th>{tu("time")}:</th>
                        <td>
                          <FormattedDate value={transaction.timestamp} />&nbsp;
                          <FormattedTime value={transaction.timestamp} />&nbsp;
                          {/*(<TimeAgoI18N date={transaction.timestamp} activeLanguage={activeLanguage}/>)*/}
                        </td>
                      </tr>
                    }
                    </tbody>
                  </table>
                </div>

                <div className="card mt-3">
                  <div className="card-header">
                    <ul className="nav nav-tabs card-header-tabs">
                      {
                        Object.values(tabs).map(tab => (
                          <li key={tab.id} className="nav-item">
                            <NavLink exact to={match.url + tab.path} className="nav-link text-dark" >
                              <i className={tab.icon + " mr-2"} />
                              {tab.label}
                            </NavLink>
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                  <div className="card-body p-0">
                    <Switch>
                      {
                        Object.values(tabs).map(tab => (
                          <Route key={tab.id} exact path={match.url + tab.path} render={(props) => (<tab.cmp />)} />
                        ))
                      }
                    </Switch>
                  </div>
                </div>
              </div>
            </div>

        }
      </main>
    )
  }

}


function mapStateToProps(state) {

  return {
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
