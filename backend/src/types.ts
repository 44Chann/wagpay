export interface definitions {
	Invoices: {
	  /**
	   * Format: bigint
	   * @description Note:
	   * This is a Primary Key.<pk/>
	   */
	  id: number;
	  /**
	   * Format: timestamp with time zone
	   * @default now()
	   */
	  created_at?: string;
	  /**
	   * Format: bigint
	   * @description Note:
	   * This is a Foreign Key to `Store.id`.<fk table='Store' column='id'/>
	   */
	  store?: number;
	  /**
	   * Format: bigint
	   * @description Note:
	   * This is a Foreign Key to `Payer.id`.<fk table='Payer' column='id'/>
	   */
	  payer?: number;
	  /** Format: text */
	  eth_address?: string;
	  /** Format: text */
	  sol_address?: string;
	  /** Format: double precision */
	  amount: number;
	  /** Format: text */
	  currency_paid_in: string;
	  /** Format: bigint */
	  tax_percent?: number;
	  /** Format: boolean */
	  is_settled: boolean;
	};
	/** @description Address which is not store owner */
	Payer: {
	  /**
	   * Format: bigint
	   * @description Note:
	   * This is a Primary Key.<pk/>
	   */
	  id: number;
	  /**
	   * Format: timestamp with time zone
	   * @default now()
	   */
	  created_at?: string;
	  /** Format: text */
	  eth_address?: string;
	  /** Format: text */
	  sol_address?: string;
	  /** Format: text */
	  email: string;
	  /** Format: text */
	  address: string;
	};
	/** @description Payment Buttons */
	"Payment Button": {
	  /**
	   * Format: bigint
	   * @description Note:
	   * This is a Primary Key.<pk/>
	   */
	  id?: number;
	  /**
	   * Format: timestamp with time zone
	   * @default now()
	   */
	  created_at?: string;
	  /** Format: text */
	  unique_id: string;
	  /** Format: double precision */
	  amount: number;
	  /**
	   * Format: bigint
	   * @description Note:
	   * This is a Foreign Key to `Store.id`.<fk table='Store' column='id'/>
	   */
	  store?: number;
	  invoice?: number;
	};
	/** @description A Store/Merchant on WagPay */
	Store: {
	  /**
	   * Format: bigint
	   * @description Note:
	   * This is a Primary Key.<pk/>
	   */
	  id: number;
	  /** Format: text */
	  store_name: string;
	  /**
	   * Format: bigint
	   * @description Note:
	   * This is a Foreign Key to `User.id`.<fk table='User' column='id'/>
	   */
	  user: number;
	  /** Format: text */
	  eth_address?: string;
	  /** Format: text */
	  sol_address?: string;
	  /**
	   * Format: timestamp with time zone
	   * @default now()
	   */
	  created_at?: string;
	  /** Format: text */
	  api_key: string;
	  /** Format: ARRAY */
	  accepted_currency?: unknown[];
	};
	/** @description A Decentralized User */
	User: {
	  /**
	   * Format: bigint
	   * @description Note:
	   * This is a Primary Key.<pk/>
	   */
	  id: number;
	  /** Format: text */
	  username: string;
	  /** Format: text */
	  eth_address?: string;
	  /** Format: text */
	  sol_address?: string;
	  /** Format: boolean */
	  is_paid: boolean;
	  /**
	   * Format: timestamp with time zone
	   * @default now()
	   */
	  created_at?: string;
	};
  }
  
  export interface parameters {
	/**
	 * @description Preference
	 * @enum {string}
	 */
	preferParams: "params=single-object";
	/**
	 * @description Preference
	 * @enum {string}
	 */
	preferReturn: "return=representation" | "return=minimal" | "return=none";
	/**
	 * @description Preference
	 * @enum {string}
	 */
	preferCount: "count=none";
	/** @description Filtering Columns */
	select: string;
	/** @description On Conflict */
	on_conflict: string;
	/** @description Ordering */
	order: string;
	/** @description Limiting and Pagination */
	range: string;
	/**
	 * @description Limiting and Pagination
	 * @default items
	 */
	rangeUnit: string;
	/** @description Limiting and Pagination */
	offset: string;
	/** @description Limiting and Pagination */
	limit: string;
	/** @description Invoices */
	"body.Invoices": definitions["Invoices"];
	/** Format: bigint */
	"rowFilter.Invoices.id": string;
	/** Format: timestamp with time zone */
	"rowFilter.Invoices.created_at": string;
	/** Format: bigint */
	"rowFilter.Invoices.store": string;
	/** Format: bigint */
	"rowFilter.Invoices.payer": string;
	/** Format: text */
	"rowFilter.Invoices.eth_address": string;
	/** Format: text */
	"rowFilter.Invoices.sol_address": string;
	/** Format: double precision */
	"rowFilter.Invoices.amount": string;
	/** Format: text */
	"rowFilter.Invoices.currency_paid_in": string;
	/** Format: bigint */
	"rowFilter.Invoices.tax_percent": string;
	/** @description Payer */
	"body.Payer": definitions["Payer"];
	/** Format: bigint */
	"rowFilter.Payer.id": string;
	/** Format: timestamp with time zone */
	"rowFilter.Payer.created_at": string;
	/** Format: text */
	"rowFilter.Payer.eth_address": string;
	/** Format: text */
	"rowFilter.Payer.sol_address": string;
	/** Format: text */
	"rowFilter.Payer.email": string;
	/** Format: text */
	"rowFilter.Payer.address": string;
	/** @description Payment Button */
	"body.Payment Button": definitions["Payment Button"];
	/** Format: bigint */
	"rowFilter.Payment Button.id": string;
	/** Format: timestamp with time zone */
	"rowFilter.Payment Button.created_at": string;
	/** Format: text */
	"rowFilter.Payment Button.unique_id": string;
	/** Format: double precision */
	"rowFilter.Payment Button.amount": string;
	/** Format: bigint */
	"rowFilter.Payment Button.store": string;
	/** @description Store */
	/** Format: text */
	"rowFilter.User.username": string;
	/** Format: text */
	"rowFilter.User.eth_address": string;
	/** Format: text */
	"rowFilter.User.sol_address": string;
	/** Format: boolean */
	"rowFilter.User.is_paid": string;
	/** Format: timestamp with time zone */
	"rowFilter.User.created_at": string;
  }