const SUPER_SAVER_ABI = [
  {
    payable: true,
    stateMutability: 'payable',
    type: 'fallback'
  },
  {
    constant: true,
    inputs: [],
    name: 'Invest2FulcrumAddress',
    outputs: [
      {
        internalType: 'contract Invest2Fulcrum',
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'Invest2cDAIAddress',
    outputs: [
      {
        internalType: 'contract Invest2cDAI',
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_towhomtoIssueAddress',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_cDAIAllocation',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_slippage',
        type: 'uint256'
      }
    ],
    name: 'LetsInvest',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'destruct',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'contract IERC20',
        name: '_TokenAddress',
        type: 'address'
      }
    ],
    name: 'inCaseTokengetsStuck',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_Invest2cDAIAddress',
        type: 'address'
      }
    ],
    name: 'initialize',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'isOwner',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address payable',
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'contract Invest2Fulcrum',
        name: '_Invest2FulcrumAddress',
        type: 'address'
      }
    ],
    name: 'set_Invest2FulcrumAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'contract Invest2cDAI',
        name: '_Invest2cDAIAddress',
        type: 'address'
      }
    ],
    name: 'set_Invest2cDAIAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'toggleContractActive',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address payable',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'withdraw',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

export default SUPER_SAVER_ABI;
